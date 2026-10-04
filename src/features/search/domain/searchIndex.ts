export type SearchItemKind = "exercise" | "session" | "glossary";

export type SearchItem = {
  id: string;
  kind: SearchItemKind;
  title: string;
  subtitle: string;
  url: string;
  name: string;
  aliases: string[];
  pattern?: string;
  capabilities: string[];
  equipment: string[];
  description: string;
  keywords: string[];
};

export type SearchResult = {
  item: SearchItem;
  score: number;
  matchReasons: string[];
};

export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchIndex(
  items: SearchItem[],
  rawQuery: string,
  kindFilter?: SearchItemKind[],
): SearchResult[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const item of items) {
    if (kindFilter && kindFilter.length > 0 && !kindFilter.includes(item.kind)) {
      continue;
    }

    let score = 0;
    const matchReasons: string[] = [];

    const normId = normalizeSearchText(item.id);
    const normName = normalizeSearchText(item.name);
    const normAliases = item.aliases.map(normalizeSearchText);
    const normPattern = item.pattern ? normalizeSearchText(item.pattern) : "";
    const normCapabilities = item.capabilities.map(normalizeSearchText);
    const normEquipment = item.equipment.map(normalizeSearchText);
    const normDescription = normalizeSearchText(item.description);

    // Exact ID match or partial ID
    if (normId === query || normId.replace(/[-_]/g, "") === query.replace(/[-_]/g, "")) {
      score += 120;
      matchReasons.push("id_exact");
    } else if (normId.includes(query)) {
      score += 60;
      matchReasons.push("id_partial");
    }

    // Name match
    if (normName === query) {
      score += 100;
      matchReasons.push("name_exact");
    } else if (normName.startsWith(query)) {
      score += 50;
      matchReasons.push("name_prefix");
    } else if (normName.includes(query)) {
      score += 30;
      matchReasons.push("name_partial");
    }

    // Aliases match
    for (const alias of normAliases) {
      if (alias === query) {
        score += 80;
        matchReasons.push("alias_exact");
      } else if (alias.startsWith(query)) {
        score += 40;
        matchReasons.push("alias_prefix");
      } else if (alias.includes(query)) {
        score += 25;
        matchReasons.push("alias_partial");
      }
    }

    // Movement pattern match
    if (normPattern) {
      if (normPattern === query) {
        score += 60;
        matchReasons.push("pattern_exact");
      } else if (normPattern.includes(query)) {
        score += 35;
        matchReasons.push("pattern_partial");
      }
    }

    // Capabilities match
    for (const cap of normCapabilities) {
      if (cap === query) {
        score += 50;
        matchReasons.push("capability_exact");
      } else if (cap.includes(query)) {
        score += 30;
        matchReasons.push("capability_partial");
      }
    }

    // Equipment match
    for (const eq of normEquipment) {
      if (eq === query) {
        score += 50;
        matchReasons.push("equipment_exact");
      } else if (eq.includes(query)) {
        score += 30;
        matchReasons.push("equipment_partial");
      }
    }

    // Description match
    if (normDescription.includes(query)) {
      score += 15;
      matchReasons.push("description");
    }

    // Token-based matching for multi-word queries
    if (tokens.length > 1) {
      let tokensMatched = 0;
      for (const token of tokens) {
        const inId = normId.includes(token);
        const inName = normName.includes(token);
        const inAliases = normAliases.some((a) => a.includes(token));
        const inPattern = normPattern.includes(token);
        const inCapabilities = normCapabilities.some((c) => c.includes(token));
        const inEquipment = normEquipment.some((e) => e.includes(token));
        const inDesc = normDescription.includes(token);

        if (inId || inName || inAliases || inPattern || inCapabilities || inEquipment || inDesc) {
          tokensMatched += 1;
        }
      }
      if (tokensMatched === tokens.length) {
        score += 40;
      } else {
        score += tokensMatched * 5;
      }
    }

    if (score > 0) {
      results.push({
        item,
        score,
        matchReasons,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
}
