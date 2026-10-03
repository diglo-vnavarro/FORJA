# Revectoriza el wordmark FORJA v1 sin redibujarlo (decisión D-007).
#
# El master v1 estaba vectorizado desde una imagen: contornos de segmentos de 1 unidad con
# escalones. Este script conserva la geometría y solo elimina los escalones:
#   1. remuestrea cada contorno cada 0,5 unidades;
#   2. detecta las esquinas reales sobre un contorno ligeramente presuavizado;
#   3. suaviza cada tramo entre esquinas a lo largo del contorno (gaussiana, esquinas fijas);
#   4. los tramos rectos pasan a ser líneas (y se alinean al eje si se desvían <= 1,5 unidades);
#      el resto se ajusta con Bézier cúbicas (Schneider) con un error máximo de 0,25 unidades.
#
# Uso, sobre el master v1 conservado en el historial de Git:
#   git show a8336de:src/design-system/forja/brand/forja-wordmark.svg > wordmark-v1.svg
#   python assets/brand/tools/revectorizar-wordmark.py wordmark-v1.svg forja-wordmark.svg
# Requiere numpy.
import re
import sys

import numpy as np

SIG = 7.0        # suavizado a lo largo del contorno, en unidades del viewBox
PRE = 2.0        # presuavizado para detectar esquinas
WIN = 6.0        # ventana de medida del giro
ANG = 30.0       # giro mínimo (grados) para considerar esquina
STRAIGHT = 1.6   # desvío máximo respecto a la cuerda para tratar un tramo como recto
MAXERR = 0.25    # error máximo del ajuste Bézier
STEP = 0.5       # paso de remuestreo

src, out = sys.argv[1], sys.argv[2]
d = re.search(r'\sd="([^"]+)"', open(src, encoding='utf8').read()).group(1)
subs = [np.array([tuple(map(float, p)) for p in re.findall(r'([\d.]+) ([\d.]+)', s)])
        for s in d.split('Z') if s.strip()]


def gauss(sigma):
    s = int(3 * sigma / STEP)
    k = np.exp(-0.5 * (np.arange(-s, s + 1) * STEP / sigma) ** 2)
    return s, k / k.sum()


def circular(Q, sigma):
    s, k = gauss(sigma)
    return np.column_stack([np.convolve(np.concatenate([Q[-s:, c], Q[:, c], Q[:s, c]]), k, 'valid') for c in (0, 1)])


def resample(P):
    P = np.vstack([P, P[:1]])
    cum = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(P, axis=0).T))])
    t = np.arange(0, cum[-1], STEP)
    return np.column_stack([np.interp(t, cum, P[:, 0]), np.interp(t, cum, P[:, 1])])


def corners(Q):
    n, w = len(Q), int(WIN / STEP)
    Z = circular(Q, PRE)
    a, b = Z - np.roll(Z, w, 0), np.roll(Z, -w, 0) - Z
    ang = np.degrees(np.abs(np.arctan2(a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0], (a * b).sum(1))))
    return [i for i in range(n) if ang[i] > ANG and ang[i] >= ang[(i + np.arange(-w, w + 1)) % n].max()
            and not any(ang[(i + k) % n] == ang[i] for k in range(1, w + 1))]


def smooth_run(run):
    m = len(run)
    s, _ = gauss(SIG)
    kk = min(s, m // 2 - 1)
    if kk < 1:
        return run
    kr = np.exp(-0.5 * (np.arange(-kk, kk + 1) * STEP / SIG) ** 2)
    kr /= kr.sum()
    # reflexión impar: los extremos (esquinas) quedan fijos
    ext = np.vstack([2 * run[0] - run[kk:0:-1], run, 2 * run[-1] - run[-2:-kk - 2:-1]])
    return np.column_stack([np.convolve(ext[:, c], kr, 'valid') for c in (0, 1)])


# ---------------------------------------------------------------- ajuste Bézier (Schneider)
def bez(c, t):
    t = t[:, None]
    return (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[1] + 3 * (1 - t) * t ** 2 * c[2] + t ** 3 * c[3]


def bezd(c, t):
    t = t[:, None]
    return 3 * (1 - t) ** 2 * (c[1] - c[0]) + 6 * (1 - t) * t * (c[2] - c[1]) + 3 * t ** 2 * (c[3] - c[2])


def bezdd(c, t):
    t = t[:, None]
    return 6 * (1 - t) * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])


def unit(v):
    n = np.hypot(*v)
    return v / n if n else v


def generate(P, u, t1, t2):
    A1, A2 = np.outer(3 * (1 - u) ** 2 * u, t1), np.outer(3 * (1 - u) * u ** 2, t2)
    C = np.array([[(A1 * A1).sum(), (A1 * A2).sum()], [(A1 * A2).sum(), (A2 * A2).sum()]])
    tmp = P - bez(np.array([P[0], P[0], P[-1], P[-1]]), u)
    X = np.array([(A1 * tmp).sum(), (A2 * tmp).sum()])
    seg = np.hypot(*(P[-1] - P[0]))
    if abs(np.linalg.det(C)) > 1e-12:
        a1, a2 = np.linalg.solve(C, X)
        if a1 > 1e-6 * seg and a2 > 1e-6 * seg:
            return np.array([P[0], P[0] + a1 * t1, P[-1] + a2 * t2, P[-1]])
    a = seg / 3
    return np.array([P[0], P[0] + a * t1, P[-1] + a * t2, P[-1]])


def fit(P, t1, t2):
    if len(P) == 2:
        a = np.hypot(*(P[1] - P[0])) / 3
        return [np.array([P[0], P[0] + a * t1, P[1] + a * t2, P[1]])]
    u = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(P, axis=0).T))])
    u /= u[-1]
    for _ in range(20):
        c = generate(P, u, t1, t2)
        e = np.hypot(*(bez(c, u) - P).T)
        i = e.argmax()
        if e[i] < MAXERR:
            return [c]
        q, q1, q2 = bez(c, u) - P, bezd(c, u), bezdd(c, u)
        den = (q1 * q1).sum(1) + (q * q2).sum(1)
        u = np.clip(u - np.divide((q * q1).sum(1), den, out=np.zeros_like(den), where=den != 0), 0, 1)
        u = np.maximum.accumulate(u)
    i = max(1, min(len(P) - 2, i))
    tc = unit(P[i - 1] - P[i + 1])
    return fit(P[:i + 1], t1, tc) + fit(P[i:], -tc, t2)


def fmt(v):
    return f"{v:.2f}".rstrip('0').rstrip('.')


def curve(c):
    return "C" + " ".join(f"{fmt(c[i][0])} {fmt(c[i][1])}" for i in (1, 2, 3))


parts, rectas, curvas = [], 0, 0
for P in subs:
    Q = resample(P)
    n = len(Q)
    idx = corners(Q)
    if not idx:
        # contorno cerrado sin esquinas (la O): suavizado circular y tangente continua
        Z = circular(Q, SIG)
        Z = np.vstack([Z, Z[:1]])
        t = unit(Z[1] - Z[-2])
        cs = fit(Z, t, -t)
        curvas += len(cs)
        parts.append(f"M{fmt(Z[0][0])} {fmt(Z[0][1])}" + "".join(curve(c) for c in cs) + "Z")
        continue
    runs = []
    for j, i0 in enumerate(idx):
        m = (idx[(j + 1) % len(idx)] - i0) % n or n
        run = Q[np.arange(i0, i0 + m + 1) % n].copy()
        a0, a1 = run[0], run[-1]
        dv = a1 - a0
        L = np.hypot(*dv)
        dist = np.abs((run[:, 0] - a0[0]) * dv[1] - (run[:, 1] - a0[1]) * dv[0]) / L if L else np.zeros(1)
        runs.append((run, L > 0 and dist.max() < STRAIGHT))
    C = np.array([r[0][0] for r in runs])
    for j, (run, recto) in enumerate(runs):
        k = (j + 1) % len(runs)
        dx, dy = C[k] - C[j]
        if recto and abs(dx) <= 1.5 and abs(dy) > 20:
            C[j][0] = C[k][0] = round((C[j][0] + C[k][0]) / 2)
        if recto and abs(dy) <= 1.5 and abs(dx) > 20:
            C[j][1] = C[k][1] = round((C[j][1] + C[k][1]) / 2)
    for j, (run, _) in enumerate(runs):
        run[0], run[-1] = C[j], C[(j + 1) % len(runs)]
    cmds = [f"M{fmt(C[0][0])} {fmt(C[0][1])}"]
    for run, recto in runs:
        a0, a1 = run[0], run[-1]
        if recto:
            cmds.append(f"L{fmt(a1[0])} {fmt(a1[1])}")
            rectas += 1
            continue
        sm = smooth_run(run)
        sm[0], sm[-1] = a0, a1
        k = max(2, int(2 / STEP))
        cs = fit(sm, unit(sm[k] - sm[0]), unit(sm[-1 - k] - sm[-1]))
        curvas += len(cs)
        cmds += [curve(c) for c in cs]
    parts.append("".join(cmds[:-1] if cmds[-1].startswith('L') else cmds) + "Z")

with open(out, 'w', encoding='utf8', newline='\n') as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1502 271" role="img" aria-label="FORJA">\n'
            '<title>FORJA wordmark v2</title>\n'
            f'<path fill="currentColor" fill-rule="evenodd" d="{"".join(parts)}"/>\n</svg>\n')
print(f"{len(subs)} contornos, {rectas} rectas, {curvas} curvas")
