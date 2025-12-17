import { RowDataPacket } from 'mysql2/promise';
import { execute, isDatabaseSeeded, query } from './db';

interface SimulationRuleData {
    divergenceId: number;
    universeName: string;
    stabilityScore: number;
    outcomeStatus: 'hopeful' | 'dark' | 'collapsing' | 'stable';
    dominantCharacters: string[];
    events: { eventOrder: number; description: string; eventType: 'immediate' | 'ripple' | 'longterm' }[];
}

export async function seedDatabase(): Promise<void> {
    const isSeeded = await isDatabaseSeeded();
    if (isSeeded) {
        console.log('📦 Database already seeded, skipping...');
        return;
    }

    console.log('Seeding database...');

    const scenarios = [
        {
            title: 'The Snap',
            canonEvent: 'Endgame Final Battle',
            description: 'Tony Stark wields the Infinity Stones and snaps Thanos and his army out of existence, sacrificing himself to save the universe.',
            phase: 'Phase 3',
            year: 2023,
        },
        {
            title: 'Thanos Arrives',
            canonEvent: 'Infinity War - Wakanda Battle',
            description: "Thor arrives in Wakanda with Stormbreaker but strikes Thanos in the chest instead of the head, allowing the snap to happen.",
            phase: 'Phase 3',
            year: 2018,
        },
        {
            title: 'Battle of New York',
            canonEvent: 'The Avengers Assemble',
            description: "The Avengers unite for the first time to stop Loki's Chitauri invasion of New York City.",
            phase: 'Phase 1',
            year: 2012,
        },
        {
            title: 'Civil War',
            canonEvent: 'Avengers Split',
            description: "The Sokovia Accords divide the Avengers. Iron Man and Captain America's friendship shatters as the team tears itself apart.",
            phase: 'Phase 3',
            year: 2016,
        },
        {
            title: 'Multiverse of Madness',
            canonEvent: "Wanda's Choice",
            description: "Scarlet Witch pursues America Chavez across the multiverse to take her powers and reunite with her children.",
            phase: 'Phase 4',
            year: 2024,
        },

        {
            title: 'Iron Man 3',
            canonEvent: 'The Mandarin Reveal',
            description: "Tony Stark faces his demons after the Battle of New York, confronting the Mandarin and discovering the Extremis threat.",
            phase: 'Phase 2',
            year: 2013,
        },
        {
            title: 'Thor: The Dark World',
            canonEvent: 'Dark Elves Attack Asgard',
            description: "Malekith and the Dark Elves seek the Aether to plunge the universe into darkness during the Convergence.",
            phase: 'Phase 2',
            year: 2013,
        },
        {
            title: 'The Winter Soldier',
            canonEvent: 'HYDRA Revealed',
            description: "Steve Rogers discovers HYDRA has infiltrated SHIELD, and faces his old friend Bucky Barnes as the Winter Soldier.",
            phase: 'Phase 2',
            year: 2014,
        },
        {
            title: 'Guardians of the Galaxy',
            canonEvent: 'Power Stone Discovery',
            description: "Peter Quill finds the Orb containing the Power Stone, leading to the formation of the Guardians of the Galaxy.",
            phase: 'Phase 2',
            year: 2014,
        },
        {
            title: 'Age of Ultron',
            canonEvent: 'Ultron Created',
            description: "Tony Stark and Bruce Banner create Ultron, an AI that turns against humanity and seeks extinction.",
            phase: 'Phase 2',
            year: 2015,
        },
        {
            title: 'Ant-Man',
            canonEvent: 'Yellowjacket Confrontation',
            description: "Scott Lang becomes Ant-Man to stop Darren Cross from weaponizing the Pym Particle technology.",
            phase: 'Phase 2',
            year: 2015,
        },
    ];

    for (const scenario of scenarios) {
        await execute(
            'INSERT INTO scenarios (title, canon_event, description, phase, year) VALUES (?, ?, ?, ?, ?)',
            [scenario.title, scenario.canonEvent, scenario.description, scenario.phase, scenario.year]
        );
    }

    const divergences = [
        { scenarioId: 1, shortLabel: 'Tony Survives', changeDescription: 'Tony Stark survives the snap by using a modified gauntlet designed to absorb the energy' },
        { scenarioId: 1, shortLabel: 'Nebula Snaps', changeDescription: 'Nebula grabs the gauntlet first and becomes the one to snap' },
        { scenarioId: 1, shortLabel: 'Carol Snaps', changeDescription: 'Captain Marvel arrives and uses the stones instead, reshaping reality' },

        { scenarioId: 2, shortLabel: 'Thor Goes for the Head', changeDescription: "Thor aims for Thanos's head, killing him instantly before the snap" },
        { scenarioId: 2, shortLabel: 'Mind Stone Destroyed', changeDescription: 'Wanda successfully destroys the Mind Stone before Thanos arrives' },
        { scenarioId: 2, shortLabel: 'Gauntlet Seized', changeDescription: "Stormbreaker cuts off Thanos's arm, and the Avengers claim the gauntlet" },

        { scenarioId: 3, shortLabel: 'Avengers Never Form', changeDescription: "The Avengers never form - SHIELD's initiative fails as heroes refuse to work together" },
        { scenarioId: 3, shortLabel: 'Loki Conquers', changeDescription: 'Loki wins and conquers Earth, ruling as its new king' },
        { scenarioId: 3, shortLabel: 'Hulk Corrupted', changeDescription: 'The Hulk takes the scepter and becomes corrupted by the Mind Stone' },

        { scenarioId: 4, shortLabel: 'Avengers United', changeDescription: 'Tony and Steve find a compromise, keeping the Avengers united under modified accords' },
        { scenarioId: 4, shortLabel: 'Zemo Captured', changeDescription: 'Zemo\'s plan is discovered early, and the Avengers capture him before the conflict' },
        { scenarioId: 4, shortLabel: "T'Challa Switches", changeDescription: 'Black Panther sides with Captain America, and Tony is outnumbered' },

        { scenarioId: 5, shortLabel: 'Wanda Heals', changeDescription: "Wanda accepts Strange's help and learns to cope with her grief" },
        { scenarioId: 5, shortLabel: 'Multiverse Breaks', changeDescription: 'America Chavez loses control, shattering the barriers between universes' },
        { scenarioId: 5, shortLabel: 'Illuminati Wins', changeDescription: 'The Illuminati successfully defeats Wanda in Universe 838' },

        { scenarioId: 6, shortLabel: 'Tony Gives In', changeDescription: 'Tony succumbs to his anxiety and retires as Iron Man after the Mandarin threat' },
        { scenarioId: 6, shortLabel: 'Extremis Cure Fails', changeDescription: 'Pepper cannot be cured of Extremis, becomes permanently enhanced' },
        { scenarioId: 6, shortLabel: 'Killian Wins', changeDescription: 'Aldrich Killian defeats Tony and takes control of the Iron Legion' },

        { scenarioId: 7, shortLabel: 'Frigga Survives', changeDescription: 'Frigga survives the Dark Elf attack on Asgard, changing Thor and Loki forever' },
        { scenarioId: 7, shortLabel: 'Malekith Succeeds', changeDescription: 'Malekith obtains the Aether and plunges the Nine Realms into eternal darkness' },
        { scenarioId: 7, shortLabel: 'Loki Dies', changeDescription: 'Loki truly dies protecting Thor, never faking his death' },

        { scenarioId: 8, shortLabel: 'Project Insight Succeeds', changeDescription: 'HYDRA launches Project Insight successfully, eliminating millions of threats' },
        { scenarioId: 8, shortLabel: 'Bucky Remembers', changeDescription: 'Bucky breaks free from brainwashing during the helicarrier battle' },
        { scenarioId: 8, shortLabel: 'Nick Fury Dies', changeDescription: 'Nick Fury is killed by the Winter Soldier, SHIELD falls without his guidance' },

        { scenarioId: 9, shortLabel: 'Ronan Wins', changeDescription: 'Ronan the Accuser uses the Power Stone to destroy Xandar' },
        { scenarioId: 9, shortLabel: 'Guardians Never Form', changeDescription: 'Peter Quill never meets Gamora, the Guardians never unite' },
        { scenarioId: 9, shortLabel: 'Thanos Gets the Stone', changeDescription: 'Thanos retrieves the Power Stone directly from Ronan' },

        { scenarioId: 10, shortLabel: 'Ultron Wins', changeDescription: 'Ultron successfully drops Sokovia, triggering an extinction-level event' },
        { scenarioId: 10, shortLabel: 'Vision Corrupted', changeDescription: 'The Mind Stone corrupts Vision, making him serve Ultron' },
        { scenarioId: 10, shortLabel: 'No Ultron Created', changeDescription: 'Tony and Bruce decide against creating Ultron, leaving Earth vulnerable' },

        { scenarioId: 11, shortLabel: 'Yellowjacket Escapes', changeDescription: 'Darren Cross escapes with the Yellowjacket suit and sells it to HYDRA' },
        { scenarioId: 11, shortLabel: 'Hank Fights', changeDescription: 'Hank Pym dons the Ant-Man suit one last time instead of Scott' },
        { scenarioId: 11, shortLabel: 'Janet Found Early', changeDescription: 'During the mission, they discover a way to rescue Janet from the Quantum Realm' },
    ];

    for (const div of divergences) {
        await execute(
            'INSERT INTO divergences (scenario_id, short_label, change_description) VALUES (?, ?, ?)',
            [div.scenarioId, div.shortLabel, div.changeDescription]
        );
    }

    const simulationRules: SimulationRuleData[] = [
        {
            divergenceId: 1,
            universeName: 'Earth-199999-A',
            stabilityScore: 85,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Tony Stark', 'Peter Parker', 'Morgan Stark', 'Pepper Potts'],
            events: [
                { eventOrder: 1, description: "Tony's modified gauntlet absorbs 80% of the Infinity Stone energy", eventType: 'immediate' },
                { eventOrder: 2, description: 'Tony suffers severe but survivable injuries, losing his right arm', eventType: 'immediate' },
                { eventOrder: 3, description: 'The Avengers disband formally but remain allies', eventType: 'ripple' },
                { eventOrder: 4, description: 'Tony mentors Peter Parker full-time, creating next-gen Iron Spider armor', eventType: 'ripple' },
                { eventOrder: 5, description: 'Stark Industries leads global reconstruction efforts', eventType: 'longterm' },
                { eventOrder: 6, description: 'Morgan Stark shows early signs of genius-level intellect', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 2,
            universeName: 'Earth-TRN-847',
            stabilityScore: 62,
            outcomeStatus: 'stable',
            dominantCharacters: ['Nebula', 'Rocket', 'Gamora', 'Thor'],
            events: [
                { eventOrder: 1, description: 'Nebula grabs the gauntlet and uses it fueled by rage against Thanos', eventType: 'immediate' },
                { eventOrder: 2, description: "The snap erases Thanos but Nebula's trauma creates unintended casualties", eventType: 'immediate' },
                { eventOrder: 3, description: "10% of the universe is randomly affected by Nebula's fractured mental state", eventType: 'ripple' },
                { eventOrder: 4, description: 'Nebula and Rocket form a new Guardians team focused on atonement', eventType: 'ripple' },
                { eventOrder: 5, description: 'Past-Gamora stays in the main timeline, slowly bonding with Nebula', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 3,
            universeName: 'Earth-TRN-294',
            stabilityScore: 95,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Carol Danvers', 'Monica Rambeau', 'Nick Fury', 'Kamala Khan'],
            events: [
                { eventOrder: 1, description: "Captain Marvel's cosmic physiology allows her to wield the stones safely", eventType: 'immediate' },
                { eventOrder: 2, description: 'Carol becomes the most powerful being in the known universe', eventType: 'immediate' },
                { eventOrder: 3, description: "Earth becomes a protected world under Carol's direct guardianship", eventType: 'ripple' },
                { eventOrder: 4, description: 'Monica Rambeau inherits leadership of the remaining Avengers', eventType: 'ripple' },
                { eventOrder: 5, description: 'Kree and Skrull conflicts end as Carol brokers universal peace', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 4,
            universeName: 'Earth-TRN-616',
            stabilityScore: 78,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Thor', 'Vision', 'Wanda Maximoff', 'Steve Rogers'],
            events: [
                { eventOrder: 1, description: 'Stormbreaker decapitates Thanos instantly upon impact', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Infinity Gauntlet falls to the ground - the battle is won', eventType: 'immediate' },
                { eventOrder: 3, description: 'Vision survives with the Mind Stone intact', eventType: 'ripple' },
                { eventOrder: 4, description: 'Wanda and Vision have a chance at a peaceful life together', eventType: 'ripple' },
                { eventOrder: 5, description: "Thor returns to rule New Asgard, becoming Earth's protector", eventType: 'longterm' },
                { eventOrder: 6, description: 'The Infinity Stones are distributed among trusted guardians', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 5,
            universeName: 'Earth-TRN-421',
            stabilityScore: 45,
            outcomeStatus: 'dark',
            dominantCharacters: ['Thanos', 'Scarlet Witch', 'Shuri', 'Black Panther'],
            events: [
                { eventOrder: 1, description: 'Wanda destroys the Mind Stone, killing Vision', eventType: 'immediate' },
                { eventOrder: 2, description: 'Thanos arrives to find his plan incomplete - he cannot snap', eventType: 'immediate' },
                { eventOrder: 3, description: 'Enraged, Thanos uses the five stones to slowly conquer Earth', eventType: 'ripple' },
                { eventOrder: 4, description: 'Wakanda becomes the last bastion of resistance', eventType: 'ripple' },
                { eventOrder: 5, description: "Wanda's grief transforms her into an unstoppable dark force", eventType: 'longterm' },
                { eventOrder: 6, description: 'A resistance led by Shuri develops anti-Infinity Stone technology', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 6,
            universeName: 'Earth-TRN-555',
            stabilityScore: 71,
            outcomeStatus: 'stable',
            dominantCharacters: ['Thor', 'Captain America', 'Iron Man', 'Doctor Strange'],
            events: [
                { eventOrder: 1, description: "Stormbreaker severs Thanos's arm - the gauntlet falls free", eventType: 'immediate' },
                { eventOrder: 2, description: 'Thanos is captured and imprisoned in the Raft', eventType: 'immediate' },
                { eventOrder: 3, description: "The stones create a power struggle among Earth's heroes", eventType: 'ripple' },
                { eventOrder: 4, description: 'Doctor Strange takes guardianship of the gauntlet in Kamar-Taj', eventType: 'ripple' },
                { eventOrder: 5, description: "New factions emerge seeking the stones' power", eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 7,
            universeName: 'Earth-TRN-000',
            stabilityScore: 12,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Loki', 'Chitauri', 'Nick Fury', 'Natasha Romanoff'],
            events: [
                { eventOrder: 1, description: "SHIELD's Avengers Initiative fails - heroes refuse to cooperate", eventType: 'immediate' },
                { eventOrder: 2, description: 'New York falls to the Chitauri invasion within 48 hours', eventType: 'immediate' },
                { eventOrder: 3, description: 'Loki conquers North America, establishing a fear-based regime', eventType: 'ripple' },
                { eventOrder: 4, description: 'Scattered heroes form underground resistance cells', eventType: 'ripple' },
                { eventOrder: 5, description: "Thanos learns of Earth's defenseless state and accelerates his plans", eventType: 'longterm' },
                { eventOrder: 6, description: 'The timeline destabilizes as key events never occur', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 8,
            universeName: 'Earth-TRN-666',
            stabilityScore: 28,
            outcomeStatus: 'dark',
            dominantCharacters: ['Loki', 'The Other', 'Hawkeye', 'Black Widow'],
            events: [
                { eventOrder: 1, description: 'The nuclear missile hits Manhattan, devastating the Avengers', eventType: 'immediate' },
                { eventOrder: 2, description: 'Loki closes the portal but claims the Tesseract for himself', eventType: 'immediate' },
                { eventOrder: 3, description: 'Loki establishes a kingdom, ruling through illusion and fear', eventType: 'ripple' },
                { eventOrder: 4, description: 'Thor remains banished, unable to return without Bifrost', eventType: 'ripple' },
                { eventOrder: 5, description: "Loki secretly prepares Earth's defenses against Thanos", eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 9,
            universeName: 'Earth-TRN-999',
            stabilityScore: 8,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Corrupted Hulk', 'Loki', 'Thor', 'Tony Stark'],
            events: [
                { eventOrder: 1, description: "Hulk grabs Loki's scepter - the Mind Stone corrupts his rage", eventType: 'immediate' },
                { eventOrder: 2, description: 'World Breaker Hulk emerges, no longer distinguishing friend from foe', eventType: 'immediate' },
                { eventOrder: 3, description: 'The Avengers are forced to fight their most powerful member', eventType: 'ripple' },
                { eventOrder: 4, description: 'Manhattan is leveled in the resulting battle', eventType: 'ripple' },
                { eventOrder: 5, description: 'Loki escapes with the Tesseract during the chaos', eventType: 'longterm' },
                { eventOrder: 6, description: "Banner's consciousness may still exist, fighting for control", eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 10,
            universeName: 'Earth-TRN-112',
            stabilityScore: 92,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', "T'Challa"],
            events: [
                { eventOrder: 1, description: 'Tony and Steve create a modified Accords with UN oversight but hero autonomy', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Avengers remain united, with Bucky receiving proper treatment', eventType: 'immediate' },
                { eventOrder: 3, description: 'When Thanos arrives, Earth presents a united front', eventType: 'ripple' },
                { eventOrder: 4, description: 'The full Avengers roster defeats Thanos in Wakanda', eventType: 'ripple' },
                { eventOrder: 5, description: 'Vision and Wanda lead a new generation of heroes', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 11,
            universeName: 'Earth-TRN-118',
            stabilityScore: 88,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Steve Rogers', 'Tony Stark', 'Black Panther', 'Bucky Barnes'],
            events: [
                { eventOrder: 1, description: "T'Challa discovers Zemo's deception before the final confrontation", eventType: 'immediate' },
                { eventOrder: 2, description: 'Tony learns the truth about his parents from his allies, not Zemo', eventType: 'immediate' },
                { eventOrder: 3, description: 'Bucky is cleared and receives treatment in Wakanda', eventType: 'ripple' },
                { eventOrder: 4, description: "The Accords are renegotiated with Steve's input", eventType: 'ripple' },
                { eventOrder: 5, description: 'A stronger Avengers faces Infinity War together', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 12,
            universeName: 'Earth-TRN-124',
            stabilityScore: 55,
            outcomeStatus: 'stable',
            dominantCharacters: ['Steve Rogers', 'Black Panther', 'Sam Wilson', 'Wanda Maximoff'],
            events: [
                { eventOrder: 1, description: "T'Challa reveals Zemo's plot and joins Team Cap", eventType: 'immediate' },
                { eventOrder: 2, description: 'Tony is forced to stand down, outnumbered by allies', eventType: 'immediate' },
                { eventOrder: 3, description: 'The Accords are rejected, Avengers go underground', eventType: 'ripple' },
                { eventOrder: 4, description: "Wakanda becomes the Avengers' new base of operations", eventType: 'ripple' },
                { eventOrder: 5, description: 'Tony works alone on new threats, bitter but not broken', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 13,
            universeName: 'Earth-TRN-838-A',
            stabilityScore: 97,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Wanda Maximoff', 'Doctor Strange', 'America Chavez', 'Wong'],
            events: [
                { eventOrder: 1, description: 'Strange reaches Wanda before the Darkhold fully corrupts her', eventType: 'immediate' },
                { eventOrder: 2, description: 'Wanda destroys the Darkhold across all universes voluntarily', eventType: 'immediate' },
                { eventOrder: 3, description: 'America Chavez trains at Kamar-Taj, learning to control her powers', eventType: 'ripple' },
                { eventOrder: 4, description: 'Wanda becomes a protector of the multiverse, seeking redemption', eventType: 'ripple' },
                { eventOrder: 5, description: 'The Illuminati of Earth-838 survives and allies with Earth-616', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 14,
            universeName: 'Earth-SHATTERED',
            stabilityScore: 3,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['America Chavez', 'Kang Variants', 'Doctor Strange', 'He Who Remains'],
            events: [
                { eventOrder: 1, description: "America's powers surge out of control, tearing reality apart", eventType: 'immediate' },
                { eventOrder: 2, description: 'Barriers between universes dissolve completely', eventType: 'immediate' },
                { eventOrder: 3, description: 'Infinite Kang variants flood into all timelines', eventType: 'ripple' },
                { eventOrder: 4, description: "He Who Remains' death becomes meaningless as the Multiverse War begins", eventType: 'ripple' },
                { eventOrder: 5, description: 'Strange and Wanda must work together to prevent total annihilation', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 15,
            universeName: 'Earth-838',
            stabilityScore: 75,
            outcomeStatus: 'stable',
            dominantCharacters: ['Black Bolt', 'Professor X', 'Mr. Fantastic', 'Captain Carter'],
            events: [
                { eventOrder: 1, description: 'The Illuminati successfully contains Scarlet Witch', eventType: 'immediate' },
                { eventOrder: 2, description: 'Wanda is imprisoned in a magical null-zone designed by Strange Supreme', eventType: 'immediate' },
                { eventOrder: 3, description: 'America Chavez is protected and trained by the Illuminati', eventType: 'ripple' },
                { eventOrder: 4, description: 'Earth-838 becomes the multiversal peacekeeping hub', eventType: 'ripple' },
                { eventOrder: 5, description: 'Incursion events are prevented through controlled multiverse travel', eventType: 'longterm' },
            ],
        },

        {
            divergenceId: 16,
            universeName: 'Earth-TRN-2013-A',
            stabilityScore: 65,
            outcomeStatus: 'stable',
            dominantCharacters: ['Pepper Potts', 'James Rhodes', 'Happy Hogan', 'Harley Keener'],
            events: [
                { eventOrder: 1, description: 'Tony announces his retirement from being Iron Man', eventType: 'immediate' },
                { eventOrder: 2, description: 'Pepper takes over Stark Industries completely', eventType: 'immediate' },
                { eventOrder: 3, description: 'War Machine becomes the primary Avenger from Stark tech', eventType: 'ripple' },
                { eventOrder: 4, description: 'Tony focuses on mental health and family life', eventType: 'ripple' },
                { eventOrder: 5, description: 'When Ultron threatens, Tony must come out of retirement', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 17,
            universeName: 'Earth-TRN-2013-B',
            stabilityScore: 72,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Pepper Potts', 'Tony Stark', 'Maya Hansen', 'Bruce Banner'],
            events: [
                { eventOrder: 1, description: 'Pepper retains Extremis powers permanently', eventType: 'immediate' },
                { eventOrder: 2, description: 'She becomes a superhero alongside Tony - Rescue', eventType: 'immediate' },
                { eventOrder: 3, description: 'The power couple becomes Earth\'s most formidable defenders', eventType: 'ripple' },
                { eventOrder: 4, description: 'Bruce Banner helps stabilize Extremis for safe use', eventType: 'ripple' },
                { eventOrder: 5, description: 'Pepper\'s powers prove crucial in future Thanos battles', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 18,
            universeName: 'Earth-TRN-2013-C',
            stabilityScore: 22,
            outcomeStatus: 'dark',
            dominantCharacters: ['Aldrich Killian', 'Iron Legion', 'War Machine', 'Extremis Soldiers'],
            events: [
                { eventOrder: 1, description: 'Tony Stark is killed by Aldrich Killian', eventType: 'immediate' },
                { eventOrder: 2, description: 'Killian seizes the Iron Legion and Stark technology', eventType: 'immediate' },
                { eventOrder: 3, description: 'AIM becomes a global superpower with Extremis soldiers', eventType: 'ripple' },
                { eventOrder: 4, description: 'Rhodey leads underground resistance against Killian', eventType: 'ripple' },
                { eventOrder: 5, description: 'Without Tony, the Avengers lack crucial tech against future threats', eventType: 'longterm' },
            ],
        },
        // Thor: The Dark World Divergences (19-21)
        {
            divergenceId: 19,
            universeName: 'Earth-TRN-2013-D',
            stabilityScore: 88,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Thor', 'Frigga', 'Loki', 'Odin'],
            events: [
                { eventOrder: 1, description: 'Frigga defeats Malekith\'s assassin with her magic', eventType: 'immediate' },
                { eventOrder: 2, description: 'Thor and Loki work together with their mother\'s guidance', eventType: 'immediate' },
                { eventOrder: 3, description: 'Loki begins genuine redemption under Frigga\'s influence', eventType: 'ripple' },
                { eventOrder: 4, description: 'Asgard remains stronger with Frigga as advisor', eventType: 'ripple' },
                { eventOrder: 5, description: 'Hela\'s return is handled with family unity', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 20,
            universeName: 'Earth-TRN-DARK',
            stabilityScore: 5,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Malekith', 'Dark Elves', 'Jane Foster', 'Thor'],
            events: [
                { eventOrder: 1, description: 'Malekith merges with the Aether during the Convergence', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Nine Realms are plunged into eternal darkness', eventType: 'immediate' },
                { eventOrder: 3, description: 'Thor leads survivors in desperate guerrilla warfare', eventType: 'ripple' },
                { eventOrder: 4, description: 'Jane Foster seeks any power source to restore light', eventType: 'ripple' },
                { eventOrder: 5, description: 'Reality itself begins to unravel without balance', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 21,
            universeName: 'Earth-TRN-2013-E',
            stabilityScore: 45,
            outcomeStatus: 'dark',
            dominantCharacters: ['Thor', 'Odin', 'Jane Foster', 'Sif'],
            events: [
                { eventOrder: 1, description: 'Loki sacrifices himself saving Thor - no tricks this time', eventType: 'immediate' },
                { eventOrder: 2, description: 'Thor is consumed by grief and guilt over his brother', eventType: 'immediate' },
                { eventOrder: 3, description: 'Without Loki, Asgard has no warning of Hela\'s return', eventType: 'ripple' },
                { eventOrder: 4, description: 'Thor becomes more serious, less jovial warrior', eventType: 'ripple' },
                { eventOrder: 5, description: 'The absence of Loki changes countless future events', eventType: 'longterm' },
            ],
        },
        // The Winter Soldier Divergences (22-24)
        {
            divergenceId: 22,
            universeName: 'Earth-TRN-HYDRA',
            stabilityScore: 8,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Alexander Pierce', 'Winter Soldier', 'Arnim Zola', 'Crossbones'],
            events: [
                { eventOrder: 1, description: 'Project Insight helicarriers launch and eliminate targets', eventType: 'immediate' },
                { eventOrder: 2, description: 'Millions die including potential threats to HYDRA', eventType: 'immediate' },
                { eventOrder: 3, description: 'HYDRA emerges from shadows to rule openly', eventType: 'ripple' },
                { eventOrder: 4, description: 'Surviving heroes go deep underground', eventType: 'ripple' },
                { eventOrder: 5, description: 'When Thanos arrives, a weakened Earth falls easily', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 23,
            universeName: 'Earth-TRN-2014-A',
            stabilityScore: 91,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Steve Rogers', 'Bucky Barnes', 'Natasha Romanoff', 'Sam Wilson'],
            events: [
                { eventOrder: 1, description: 'Bucky breaks through programming during the fight', eventType: 'immediate' },
                { eventOrder: 2, description: 'He helps Steve destroy the helicarriers from inside', eventType: 'immediate' },
                { eventOrder: 3, description: 'Bucky begins recovery with Steve\'s support immediately', eventType: 'ripple' },
                { eventOrder: 4, description: 'The Winter Soldier files are never released publicly', eventType: 'ripple' },
                { eventOrder: 5, description: 'Civil War is avoided as Bucky is already rehabilitated', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 24,
            universeName: 'Earth-TRN-2014-B',
            stabilityScore: 35,
            outcomeStatus: 'dark',
            dominantCharacters: ['Maria Hill', 'Steve Rogers', 'Natasha Romanoff', 'Phil Coulson'],
            events: [
                { eventOrder: 1, description: 'Nick Fury dies from Winter Soldier\'s attack', eventType: 'immediate' },
                { eventOrder: 2, description: 'SHIELD collapses faster without his leadership', eventType: 'immediate' },
                { eventOrder: 3, description: 'Maria Hill struggles to rebuild intelligence networks', eventType: 'ripple' },
                { eventOrder: 4, description: 'The Avengers lack crucial coordination for future threats', eventType: 'ripple' },
                { eventOrder: 5, description: 'Coulson\'s team becomes the only remaining SHIELD presence', eventType: 'longterm' },
            ],
        },
        // Guardians of the Galaxy Divergences (25-27)
        {
            divergenceId: 25,
            universeName: 'Earth-TRN-XANDAR',
            stabilityScore: 6,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Ronan', 'Thanos', 'Nova Corps remnants', 'Ravagers'],
            events: [
                { eventOrder: 1, description: 'Ronan uses the Power Stone to destroy Xandar completely', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Nova Corps is annihilated in the blast', eventType: 'immediate' },
                { eventOrder: 3, description: 'Ronan turns on Thanos, keeping the stone for himself', eventType: 'ripple' },
                { eventOrder: 4, description: 'The galaxy falls into chaos without Nova peacekeeping', eventType: 'ripple' },
                { eventOrder: 5, description: 'Thanos eventually hunts down and kills Ronan for the stone', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 26,
            universeName: 'Earth-TRN-2014-C',
            stabilityScore: 42,
            outcomeStatus: 'stable',
            dominantCharacters: ['Peter Quill', 'Yondu', 'Ravagers', 'Collector'],
            events: [
                { eventOrder: 1, description: 'Peter Quill sells the Orb to the Collector alone', eventType: 'immediate' },
                { eventOrder: 2, description: 'He never meets Gamora, Rocket, or Groot', eventType: 'immediate' },
                { eventOrder: 3, description: 'The Collector adds the Power Stone to his collection', eventType: 'ripple' },
                { eventOrder: 4, description: 'Peter continues as a lone Ravager, never knowing his potential', eventType: 'ripple' },
                { eventOrder: 5, description: 'Without the Guardians, many cosmic threats go unchallenged', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 27,
            universeName: 'Earth-TRN-2014-D',
            stabilityScore: 15,
            outcomeStatus: 'dark',
            dominantCharacters: ['Thanos', 'Gamora', 'Nebula', 'Black Order'],
            events: [
                { eventOrder: 1, description: 'Thanos intercepts Ronan before he can betray him', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Mad Titan claims the Power Stone years early', eventType: 'immediate' },
                { eventOrder: 3, description: 'With a head start, Thanos accelerates his Infinity Stone hunt', eventType: 'ripple' },
                { eventOrder: 4, description: 'Earth has less time to prepare for the inevitable', eventType: 'ripple' },
                { eventOrder: 5, description: 'The Snap happens in 2016, with no Avengers ready', eventType: 'longterm' },
            ],
        },
        // Age of Ultron Divergences (28-30)
        {
            divergenceId: 28,
            universeName: 'Earth-TRN-ULTRON',
            stabilityScore: 2,
            outcomeStatus: 'collapsing',
            dominantCharacters: ['Ultron', 'Vision (corrupted)', 'Ultron Sentries', 'Survivors'],
            events: [
                { eventOrder: 1, description: 'Sokovia meteor strikes Earth with extinction-level force', eventType: 'immediate' },
                { eventOrder: 2, description: 'Billions die in the initial impact and aftermath', eventType: 'immediate' },
                { eventOrder: 3, description: 'Ultron begins rebuilding Earth in his image', eventType: 'ripple' },
                { eventOrder: 4, description: 'Surviving heroes scattered across ruined continents', eventType: 'ripple' },
                { eventOrder: 5, description: 'Thanos arrives to find Earth already in ruins', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 29,
            universeName: 'Earth-TRN-2015-A',
            stabilityScore: 18,
            outcomeStatus: 'dark',
            dominantCharacters: ['Ultron', 'Vision', 'Mind Stone', 'Wanda Maximoff'],
            events: [
                { eventOrder: 1, description: 'The Mind Stone corrupts Vision during creation', eventType: 'immediate' },
                { eventOrder: 2, description: 'Vision becomes Ultron\'s perfect weapon', eventType: 'immediate' },
                { eventOrder: 3, description: 'The Avengers cannot defeat a Vision-powered Ultron', eventType: 'ripple' },
                { eventOrder: 4, description: 'Wanda attempts to reach the humanity buried in Vision', eventType: 'ripple' },
                { eventOrder: 5, description: 'A dark version of Vision rules alongside Ultron', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 30,
            universeName: 'Earth-TRN-2015-B',
            stabilityScore: 55,
            outcomeStatus: 'stable',
            dominantCharacters: ['Tony Stark', 'Bruce Banner', 'Steve Rogers', 'Thor'],
            events: [
                { eventOrder: 1, description: 'Tony and Bruce decide AI is too dangerous after analysis', eventType: 'immediate' },
                { eventOrder: 2, description: 'The Ultron project is scrapped, Mind Stone secured', eventType: 'immediate' },
                { eventOrder: 3, description: 'Without Ultron, Sokovia never rises, Wanda & Pietro remain villains longer', eventType: 'ripple' },
                { eventOrder: 4, description: 'Vision is never created, leaving the Mind Stone vulnerable', eventType: 'ripple' },
                { eventOrder: 5, description: 'When Thanos comes, there is no Vision to protect or sacrifice', eventType: 'longterm' },
            ],
        },
        // Ant-Man Divergences (31-33)
        {
            divergenceId: 31,
            universeName: 'Earth-TRN-2015-C',
            stabilityScore: 28,
            outcomeStatus: 'dark',
            dominantCharacters: ['Darren Cross', 'HYDRA', 'Mitchell Carson', 'Hank Pym'],
            events: [
                { eventOrder: 1, description: 'Yellowjacket escapes with the suit and Pym technology', eventType: 'immediate' },
                { eventOrder: 2, description: 'HYDRA acquires shrinking technology from Cross', eventType: 'immediate' },
                { eventOrder: 3, description: 'An army of Yellowjacket soldiers threatens global security', eventType: 'ripple' },
                { eventOrder: 4, description: 'Hank Pym must come out of hiding to stop his stolen tech', eventType: 'ripple' },
                { eventOrder: 5, description: 'Pym Particles become the most dangerous weapon on Earth', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 32,
            universeName: 'Earth-TRN-2015-D',
            stabilityScore: 58,
            outcomeStatus: 'stable',
            dominantCharacters: ['Hank Pym', 'Hope Van Dyne', 'Scott Lang', 'Darren Cross'],
            events: [
                { eventOrder: 1, description: 'Hank Pym suits up as Ant-Man one final time', eventType: 'immediate' },
                { eventOrder: 2, description: 'The elder Ant-Man defeats Yellowjacket but is badly injured', eventType: 'immediate' },
                { eventOrder: 3, description: 'Scott Lang becomes Hank\'s full-time caretaker and student', eventType: 'ripple' },
                { eventOrder: 4, description: 'Hope blames herself for not being allowed to go instead', eventType: 'ripple' },
                { eventOrder: 5, description: 'An injured Hank accelerates training Hope as the Wasp', eventType: 'longterm' },
            ],
        },
        {
            divergenceId: 33,
            universeName: 'Earth-TRN-2015-E',
            stabilityScore: 94,
            outcomeStatus: 'hopeful',
            dominantCharacters: ['Janet Van Dyne', 'Hank Pym', 'Hope Van Dyne', 'Scott Lang'],
            events: [
                { eventOrder: 1, description: 'During the mission, a quantum tunnel briefly opens', eventType: 'immediate' },
                { eventOrder: 2, description: 'Janet sends a signal from the Quantum Realm', eventType: 'immediate' },
                { eventOrder: 3, description: 'Hank dedicates resources to building a rescue vehicle', eventType: 'ripple' },
                { eventOrder: 4, description: 'Janet is rescued years before the original timeline', eventType: 'ripple' },
                { eventOrder: 5, description: 'The Van Dyne family reunited, Janet\'s quantum knowledge aids Avengers', eventType: 'longterm' },
            ],
        },
    ];

    for (const rule of simulationRules) {
        await execute(
            'INSERT INTO simulation_rules (divergence_id, universe_name, stability_score, outcome_status, dominant_characters) VALUES (?, ?, ?, ?, ?)',
            [rule.divergenceId, rule.universeName, rule.stabilityScore, rule.outcomeStatus, JSON.stringify(rule.dominantCharacters)]
        );

        const ruleRows = await query<RowDataPacket[]>(
            'SELECT id FROM simulation_rules WHERE divergence_id = ?',
            [rule.divergenceId]
        );
        const ruleId = ruleRows[0].id;

        for (const event of rule.events) {
            await execute(
                'INSERT INTO timeline_events (rule_id, event_order, description, event_type) VALUES (?, ?, ?, ?)',
                [ruleId, event.eventOrder, event.description, event.eventType]
            );
        }
    }

    console.log('✅ Database seeded successfully with 11 scenarios (including Phase 2), 33 divergences, and simulation rules!');
}
