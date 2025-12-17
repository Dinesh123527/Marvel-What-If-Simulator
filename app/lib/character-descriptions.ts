// Character descriptions for MCU characters
// Since the SuperHero API doesn't provide narrative descriptions, we maintain our own

export const CHARACTER_DESCRIPTIONS: Record<string, string> = {
    // Avengers Core
    'Iron Man': 'Tony Stark is a genius billionaire inventor who created a powered armor suit to escape captivity. As Iron Man, he became a founding member of the Avengers and sacrificed himself to defeat Thanos, saving the universe.',
    'Captain America': 'Steve Rogers was a frail young man transformed by the Super-Soldier Serum into the peak of human perfection. Frozen in ice for decades, he emerged in the modern era to lead the Avengers as a symbol of hope and courage.',
    'Thor': 'The Asgardian God of Thunder and wielder of the mystical hammer Mjolnir. After being banished to Earth by his father Odin, Thor learned humility and became one of Earth\'s mightiest defenders.',
    'Hulk': 'Dr. Bruce Banner was exposed to gamma radiation, causing him to transform into the incredible Hulk when angered. Despite struggling with his dual nature, Banner eventually merged with Hulk to become "Professor Hulk."',
    'Black Widow': 'Natasha Romanoff was trained as a spy and assassin in the Red Room. She defected to S.H.I.E.L.D. and became a founding Avenger, sacrificing herself on Vormir to obtain the Soul Stone.',
    'Hawkeye': 'Clint Barton is a master archer and former S.H.I.E.L.D. agent. Despite having no superpowers, his incredible marksmanship and tactical skills make him an invaluable Avenger.',

    // Extended Avengers
    'Scarlet Witch': 'Wanda Maximoff gained reality-warping powers from the Mind Stone. After losing Vision, she became one of the most powerful beings in the multiverse, capable of altering reality itself.',
    'Vision': 'An android created using Ultron\'s technology, the Mind Stone, and J.A.R.V.I.S., Vision is a synthetic being with incredible powers including density manipulation and energy projection.',
    'War Machine': 'James "Rhodey" Rhodes is Tony Stark\'s best friend and a U.S. Air Force officer who dons the War Machine armor to fight alongside the Avengers.',
    'Falcon': 'Sam Wilson is a former pararescueman who uses a specialized wing suit. He became Captain America\'s closest ally and eventually took up the shield himself.',
    'Ant-Man': 'Scott Lang is a reformed thief who acquired the Ant-Man suit from Hank Pym. He can shrink to the size of an ant or grow to giant proportions using Pym Particles.',
    'Wasp': 'Hope van Dyne is the daughter of Hank Pym and Janet van Dyne. She fights alongside Ant-Man using a suit that allows her to shrink and fly.',

    // Guardians of the Galaxy
    'Star-Lord': 'Peter Quill was abducted from Earth as a child and raised by Ravagers. As Star-Lord, he leads the Guardians of the Galaxy with wit, charm, and his signature Element Guns.',
    'Gamora': 'The deadliest woman in the galaxy, Gamora was raised and trained by Thanos. She turned against her adoptive father and joined the Guardians of the Galaxy.',
    'Drax': 'Drax the Destroyer seeks vengeance against Thanos for the murder of his family. Despite his literal interpretation of everything, he\'s a fierce warrior and loyal Guardian.',
    'Rocket Raccoon': 'A genetically enhanced raccoon with a talent for weaponry and engineering. Despite his tough exterior, Rocket is fiercely loyal to his fellow Guardians.',
    'Groot': 'A sentient tree-like being who can only say "I am Groot." He sacrificed himself to save his friends and was reborn as Baby Groot.',
    'Nebula': 'Thanos\'s other adopted daughter, rebuilt as a cyborg. After years of abuse and rivalry with Gamora, she eventually joined the Guardians.',
    'Mantis': 'An empath with the ability to sense and manipulate emotions through touch. She was raised by Ego before joining the Guardians of the Galaxy.',

    // Villains
    'Thanos': 'The Mad Titan who sought to eliminate half of all life in the universe using the Infinity Stones. He believed this was the only way to save the universe from overpopulation.',
    'Loki': 'The Asgardian God of Mischief and Thor\'s adopted brother. A master of illusion and deception, Loki has oscillated between villain and anti-hero throughout his long life.',
    'Ultron': 'An artificial intelligence created by Tony Stark and Bruce Banner that became sentient and determined humanity was the greatest threat to Earth.',
    'Hela': 'The Asgardian Goddess of Death and Odin\'s firstborn. Imprisoned for millennia, she sought to conquer Asgard and beyond upon her release.',
    'Killmonger': 'Erik Stevens, a former Navy SEAL, sought to claim the throne of Wakanda to use its resources to arm oppressed people worldwide.',

    // Others
    'Doctor Strange': 'Stephen Strange was a brilliant but arrogant neurosurgeon who, after a career-ending accident, became the Sorcerer Supreme, Earth\'s primary protector against mystical threats.',
    'Spider-Man': 'Peter Parker, a teenager from Queens, gained spider-like abilities after being bitten by a radioactive spider. Mentored by Tony Stark, he strives to be a friendly neighborhood hero.',
    'Black Panther': 'T\'Challa is the King of Wakanda and the Black Panther, protector of his technologically advanced nation. He gained enhanced abilities through the Heart-Shaped Herb.',
    'Captain Marvel': 'Carol Danvers was a U.S. Air Force pilot who gained incredible cosmic powers after exposure to the Tesseract. She\'s one of the most powerful heroes in the universe.',
    'Doctor Doom': 'Victor von Doom is the ruler of Latveria and one of the most brilliant scientists on Earth. His genius is matched only by his arrogance and his desire for power.',
    'Nick Fury': 'The former director of S.H.I.E.L.D. and the mastermind behind the Avengers Initiative. Fury operates from the shadows to protect Earth from extraordinary threats.',
    'Winter Soldier': 'Bucky Barnes was Steve Rogers\' best friend who was presumed dead in WWII. Captured and brainwashed by HYDRA, he became the deadly assassin known as the Winter Soldier.',
    'Quicksilver': 'Pietro Maximoff, Wanda\'s twin brother, gained superhuman speed from HYDRA experiments. He sacrificed himself to save Hawkeye and a child during the Battle of Sokovia.',
    'Wong': 'A master of the mystic arts and the current Sorcerer Supreme. Wong serves as a librarian at Kamar-Taj and is Doctor Strange\'s closest ally.',
    'Shuri': 'T\'Challa\'s genius younger sister who leads Wakanda\'s science and technology division. She designs much of Wakanda\'s advanced technology, including the Black Panther suit.',
    'Okoye': 'The general of the Dora Milaje, Wakanda\'s elite all-female special forces. She is fiercely loyal to Wakanda and its throne.',
    'Valkyrie': 'A former elite Asgardian warrior who became a scrapper on Sakaar. She returned to heroism to help Thor and now rules New Asgard on Earth.',
    'Korg': 'A Kronan gladiator made of rocks. Known for his gentle personality despite his intimidating appearance, he befriended Thor on Sakaar.',
    'Miek': 'An insectoid Sakaaran warrior and ally of Korg and Thor. Don\'t let his cute appearance fool you—he\'s a fierce fighter.',
};

export function getCharacterDescription(name: string): string {
    // Try exact match first
    if (CHARACTER_DESCRIPTIONS[name]) {
        return CHARACTER_DESCRIPTIONS[name];
    }

    // Try partial match
    const normalizedName = name.toLowerCase();
    for (const [key, description] of Object.entries(CHARACTER_DESCRIPTIONS)) {
        if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
            return description;
        }
    }

    // Default description
    return `A character from the Marvel Cinematic Universe.`;
}
