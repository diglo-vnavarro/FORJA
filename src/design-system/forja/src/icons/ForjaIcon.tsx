import type { ComponentType, CSSProperties } from "react";
import {
  IconAccessible,
  IconAdjustments,
  IconAffiliate,
  IconArrowBigLeftLines,
  IconArrowBigRightLines,
  IconArrowBigUpLines,
  IconArrowsExchange,
  IconArrowsMove,
  IconBallBasketball,
  IconBallFootball,
  IconBarbell,
  IconBarrierBlock,
  IconBolt,
  IconBox,
  IconClock,
  IconClockPause,
  IconCone,
  IconEye,
  IconGauge,
  IconGaugeOff,
  IconHeartBolt,
  IconHeartRateMonitor,
  IconJumpRope,
  IconListNumbers,
  IconRefresh,
  IconRepeat,
  IconRosetteDiscountCheck,
  IconRulerMeasure,
  IconRun,
  IconStretching,
  IconTarget,
  IconTargetArrow,
  IconTrophy,
  IconUser,
  IconWeight,
  IconYoga
} from "@tabler/icons-react";
import {
  ForjaKettlebellIcon,
  ForjaResistanceBandIcon,
  ForjaSledIcon,
} from "./ForjaCustomIcons";

type IconComponent = ComponentType<{
  size?: number | string;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  role?: string;
}>;

export const FORJA_ICON_MAP = {
  strength: IconBarbell,
  speed: IconRun,
  power: IconBolt,
  mobility: IconStretching,
  coordination: IconAffiliate,
  balanceStability: IconYoga,
  changeOfDirection: IconArrowsExchange,
  acceleration: IconArrowBigRightLines,
  deceleration: IconArrowBigLeftLines,
  jump: IconJumpRope,
  throw: IconBallFootball,
  endurance: IconRefresh,
  technique: IconTarget,
  aerobicCapacity: IconHeartRateMonitor,
  anaerobicCapacity: IconHeartBolt,
  externalLoad: IconWeight,
  bodyweight: IconUser,
  dumbbell: IconBarbell,
  kettlebell: ForjaKettlebellIcon,
  medicineBall: IconBallBasketball,
  cone: IconCone,
  hurdleObstacle: IconBarrierBlock,
  box: IconBox,
  time: IconClock,
  distance: IconRulerMeasure,
  repetitions: IconRepeat,
  sets: IconListNumbers,
  recovery: IconClockPause,
  rpe: IconGauge,
  rir: IconGaugeOff,
  range: IconArrowsMove,
  intention: IconTargetArrow,
  quality: IconRosetteDiscountCheck,
  competence: IconTrophy,
  observe: IconEye,
  modifyTask: IconAdjustments,
  makeMoreAccessible: IconAccessible,
  increaseDemand: IconArrowBigUpLines,
  resistanceBand: ForjaResistanceBandIcon,
  sled: ForjaSledIcon,
} as const satisfies Record<string, IconComponent>;

export type ForjaIconName = keyof typeof FORJA_ICON_MAP;

export type ForjaIconProps = {
  name: ForjaIconName;
  size?: number | string;
  stroke?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

export function ForjaIcon({
  name,
  size = 24,
  stroke = 1.8,
  title,
  className,
  style,
}: ForjaIconProps) {
  const Component = FORJA_ICON_MAP[name] as IconComponent;

  return (
    <Component
      size={size}
      stroke={stroke}
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
    />
  );
}

export const FORJA_ICON_LABELS: Record<ForjaIconName, string> = {
  strength: "Fuerza",
  speed: "Velocidad",
  power: "Potencia",
  mobility: "Movilidad",
  coordination: "Coordinación",
  balanceStability: "Equilibrio / Estabilidad",
  changeOfDirection: "Cambio de dirección",
  acceleration: "Aceleración",
  deceleration: "Deceleración",
  jump: "Salto",
  throw: "Lanzamiento",
  endurance: "Resistencia",
  technique: "Técnica",
  aerobicCapacity: "Capacidad aeróbica",
  anaerobicCapacity: "Capacidad anaeróbica",
  externalLoad: "Carga externa",
  bodyweight: "Peso corporal",
  dumbbell: "Mancuerna",
  kettlebell: "Kettlebell",
  medicineBall: "Balón medicinal",
  cone: "Cono",
  hurdleObstacle: "Valla / Obstáculo",
  box: "Cajón",
  time: "Tiempo",
  distance: "Distancia",
  repetitions: "Repeticiones",
  sets: "Series",
  recovery: "Recuperación",
  rpe: "RPE",
  rir: "RIR",
  range: "Rango",
  intention: "Intención",
  quality: "Calidad",
  competence: "Competencia",
  observe: "Observar",
  modifyTask: "Modificar tarea",
  makeMoreAccessible: "Hacer más accesible",
  increaseDemand: "Aumentar demanda",
  resistanceBand: "Goma elástica",
  sled: "Trineo",
};
