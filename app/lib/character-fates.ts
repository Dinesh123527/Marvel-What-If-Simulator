export type FateStatus =
    | 'alive'
    | 'deceased'
    | 'transformed'
    | 'unknown'
    | 'ascended'
    | 'depowered'
    | 'exiled'
    | 'imprisoned'
    | 'merged'
    | 'resurrected';

export interface CharacterFate {
    name: string;
    canonFate: FateStatus;
    canonDescription: string;
    divergentFate: FateStatus;
    divergentDescription: string;
}

// Status display configuration
export const FATE_STATUS_CONFIG: Record<FateStatus, {
    icon: string;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
}> = {
    alive: {
        icon: '✅',
        label: 'Alive',
        color: 'text-timeline-green',
        bgColor: 'bg-timeline-green/10',
        borderColor: 'border-timeline-green/30',
    },
    deceased: {
        icon: '☠️',
        label: 'Deceased',
        color: 'text-reality-red',
        bgColor: 'bg-reality-red/10',
        borderColor: 'border-reality-red/30',
    },
    transformed: {
        icon: '🔄',
        label: 'Transformed',
        color: 'text-quantum-purple',
        bgColor: 'bg-quantum-purple/10',
        borderColor: 'border-quantum-purple/30',
    },
    unknown: {
        icon: '❓',
        label: 'Unknown',
        color: 'text-text-muted',
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
    },
    ascended: {
        icon: '✨',
        label: 'Ascended',
        color: 'text-tva-gold',
        bgColor: 'bg-tva-gold/10',
        borderColor: 'border-tva-gold/30',
    },
    depowered: {
        icon: '⚡',
        label: 'Depowered',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        borderColor: 'border-orange-400/30',
    },
    exiled: {
        icon: '🌌',
        label: 'Exiled',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/30',
    },
    imprisoned: {
        icon: '🔒',
        label: 'Imprisoned',
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10',
        borderColor: 'border-gray-400/30',
    },
    merged: {
        icon: '🔗',
        label: 'Merged',
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10',
        borderColor: 'border-pink-400/30',
    },
    resurrected: {
        icon: '🌟',
        label: 'Resurrected',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10',
        borderColor: 'border-emerald-400/30',
    },
};

export const CANON_CHARACTER_FATES: Record<string, { status: FateStatus; description: string }> = {
    'Tony Stark': {
        status: 'deceased',
        description: 'Sacrificed himself using the Infinity Stones to defeat Thanos',
    },
    'Iron Man': {
        status: 'deceased',
        description: 'Sacrificed himself using the Infinity Stones to defeat Thanos',
    },
    'Steve Rogers': {
        status: 'alive',
        description: 'Retired after returning Infinity Stones, lived a full life with Peggy',
    },
    'Captain America': {
        status: 'alive',
        description: 'Retired after returning Infinity Stones, lived a full life with Peggy',
    },
    'Thor': {
        status: 'alive',
        description: 'Left with the Guardians of the Galaxy, appointed Valkyrie as King',
    },
    'Natasha Romanoff': {
        status: 'deceased',
        description: 'Sacrificed herself on Vormir to obtain the Soul Stone',
    },
    'Black Widow': {
        status: 'deceased',
        description: 'Sacrificed herself on Vormir to obtain the Soul Stone',
    },
    'Bruce Banner': {
        status: 'alive',
        description: 'Merged with Hulk as Smart Hulk, arm injured from using Infinity Stones',
    },
    'Hulk': {
        status: 'transformed',
        description: 'Now exists as Smart Hulk, a merge of Banner and Hulk',
    },
    'Clint Barton': {
        status: 'alive',
        description: 'Reunited with family, training Kate Bishop as new Hawkeye',
    },
    'Hawkeye': {
        status: 'alive',
        description: 'Reunited with family, training Kate Bishop as new Hawkeye',
    },
    'Thanos': {
        status: 'deceased',
        description: 'Killed by Thor (2018), then erased by Tony\'s snap (2014 version)',
    },
    'Vision': {
        status: 'transformed',
        description: 'Rebuilt as White Vision with original memories reconstructed',
    },
    'Wanda Maximoff': {
        status: 'unknown',
        description: 'Seemingly killed destroying the Darkhold across all universes',
    },
    'Scarlet Witch': {
        status: 'unknown',
        description: 'Seemingly killed destroying the Darkhold across all universes',
    },
    'Loki': {
        status: 'alive',
        description: 'Variant Loki exists monitoring the multiverse at the end of time',
    },
    'Peter Parker': {
        status: 'alive',
        description: 'Erased from everyone\'s memory, operates as Spider-Man alone',
    },
    'Spider-Man': {
        status: 'alive',
        description: 'Erased from everyone\'s memory, operates as Spider-Man alone',
    },
    'Doctor Strange': {
        status: 'alive',
        description: 'Dealing with multiverse consequences, third eye manifested',
    },
    'Nebula': {
        status: 'alive',
        description: 'Now a full Guardian, redeemed after Thanos\'s death',
    },
    'Gamora': {
        status: 'alive',
        description: '2014 Gamora survived, searching for her identity',
    },
};

export function getCanonFate(characterName: string): { status: FateStatus; description: string } {
    return CANON_CHARACTER_FATES[characterName] || {
        status: 'unknown',
        description: 'Fate not documented in canon records',
    };
}

export type FateChange = 'improved' | 'worsened' | 'neutral' | 'complex';

export function compareFates(canonFate: FateStatus, divergentFate: FateStatus): FateChange {
    const positiveStates: FateStatus[] = ['alive', 'ascended', 'resurrected'];
    const negativeStates: FateStatus[] = ['deceased', 'imprisoned', 'exiled'];

    const canonPositive = positiveStates.includes(canonFate);
    const canonNegative = negativeStates.includes(canonFate);
    const divergentPositive = positiveStates.includes(divergentFate);
    const divergentNegative = negativeStates.includes(divergentFate);

    if (canonFate === divergentFate) return 'neutral';
    if (!canonPositive && divergentPositive) return 'improved';
    if (canonPositive && divergentNegative) return 'worsened';
    if (canonNegative && divergentPositive) return 'improved';
    if (!canonNegative && divergentNegative) return 'worsened';

    return 'complex';
}
