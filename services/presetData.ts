import { WordItem } from '../types';
import { createNewWord } from './srsService';

export const PRESET_WORDS: Partial<WordItem>[] = [
  // Technology
  {
    word: "Ubiquitous",
    phonetic: "/juːˈbɪk.wə.təs/",
    definition: "Present, appearing, or found everywhere.",
    translation: "无所不在的",
    example: "The ubiquitous nature of smartphones has changed how we communicate.",
    topic: "Technology",
    synonyms: ["omnipresent", "pervasive", "universal"],
    antonyms: ["rare", "scarce", "absent"],
    collocations: ["ubiquitous presence", "ubiquitous access", "ubiquitous use"],
    wordFamily: ["ubiquity", "ubiquitously"]
  },
  {
    word: "Obsolescence",
    phonetic: "/ˌɒb.səˈles.əns/",
    definition: "The process of becoming no longer used or needed.",
    translation: "荒废；退化",
    example: "Planned obsolescence is a common strategy in the tech industry.",
    topic: "Technology",
    synonyms: ["decay", "decline", "desuetude"],
    antonyms: ["relevance", "currency", "usefulness"],
    collocations: ["planned obsolescence", "obsolescence rate", "technological obsolescence"],
    wordFamily: ["obsolete", "obsolescent"]
  },
  {
    word: "Automation",
    phonetic: "/ˌɔː.təˈmeɪ.ʃən/",
    definition: "The use of largely automatic equipment in a system of manufacturing or other production process.",
    translation: "自动化",
    example: "Automation will likely displace many manual jobs in the coming decade.",
    topic: "Technology",
    synonyms: ["mechanization", "computerization", "robotization"],
    antonyms: ["manual labor", "hands-on approach"],
    collocations: ["full automation", "factory automation", "process automation", "automation technology"],
    wordFamily: ["automate", "automated", "automatic"]
  },
  
  // Environment
  {
    word: "Sustainability",
    phonetic: "/səˌsteɪ.nəˈbɪl.ə.ti/",
    definition: "The ability to be maintained at a certain rate or level, often regarding the environment.",
    translation: "可持续性",
    example: "Environmental sustainability is crucial for the future of our planet.",
    topic: "Environment",
    synonyms: ["renewability", "viability", "durability"],
    antonyms: ["depletion", "exhaustion", "unsustainability"],
    collocations: ["environmental sustainability", "economic sustainability", "sustainable development", "sustainability report"],
    wordFamily: ["sustainable", "sustain", "sustainably"]
  },
  {
    word: "Biodiversity",
    phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
    definition: "The variety of plant and animal life in the world or in a particular habitat.",
    translation: "生物多样性",
    example: "The destruction of rainforests threatens global biodiversity.",
    topic: "Environment",
    synonyms: ["species diversity", "biological diversity"],
    antonyms: ["uniformity", "homogeneity"],
    collocations: ["biological diversity", "biodiversity loss", "biodiversity conservation", "genetic diversity"],
    wordFamily: ["biodiversity index", "biodiverse"]
  },
  {
    word: "Emission",
    phonetic: "/iˈmɪʃ.ən/",
    definition: "The production and discharge of something, especially gas or radiation.",
    translation: "排放",
    example: "Strict regulations are needed to control carbon emissions.",
    topic: "Environment",
    synonyms: ["discharge", "release", "output"],
    antonyms: ["absorption", "intake", "capture"],
    collocations: ["carbon emissions", "greenhouse gas emissions", "zero emissions", "emission standards"],
    wordFamily: ["emit", "emitted"]
  },

  // Education
  {
    word: "Pedagogy",
    phonetic: "/ˈped.ə.ɡɒdʒ.i/",
    definition: "The method and practice of teaching, especially as an academic subject or theoretical concept.",
    translation: "教学法",
    example: "Modern pedagogy focuses more on student-centered learning than rote memorization.",
    topic: "Education",
    synonyms: ["teaching method", "instructional design", "didactics"],
    antonyms: ["ignorance", "lack of instruction"],
    collocations: ["student-centered pedagogy", "critical pedagogy", "digital pedagogy"],
    wordFamily: ["pedagogical", "pedagogue"]
  },
  {
    word: "Curriculum",
    phonetic: "/kəˈrɪk.jə.ləm/",
    definition: "The subjects comprising a course of study in a school or college.",
    translation: "课程",
    example: "The school curriculum has been updated to include coding classes.",
    topic: "Education",
    synonyms: ["course of study", "syllabus", "program"],
    antonyms: ["informal education", "extracurricular"],
    collocations: ["curriculum design", "curriculum framework", "core curriculum", "curriculum development"],
    wordFamily: ["curricular", "curriculums"]
  },
  
  // Health & Science
  {
    word: "Sedentary",
    phonetic: "/ˈsed.ən.tər.i/",
    definition: "Tending to spend much time seated; somewhat inactive.",
    translation: "久坐的",
    example: "A sedentary lifestyle is a major risk factor for heart disease.",
    topic: "Health & Science",
    synonyms: ["inactive", "stationary", "immobile"],
    antonyms: ["active", "mobile", "dynamic"],
    collocations: ["sedentary lifestyle", "sedentary behavior", "sedentary work", "sedentary activities"],
    wordFamily: ["sedentarily", "sedentariness"]
  },
  {
    word: "Epidemic",
    phonetic: "/ˌep.ɪˈdem.ɪk/",
    definition: "A widespread occurrence of an infectious disease in a community at a particular time.",
    translation: "流行病",
    example: "Obesity has become an epidemic in many developed nations.",
    topic: "Health & Science",
    synonyms: ["pandemic", "outbreak", "plague"],
    antonyms: ["endemic", "localized"],
    collocations: ["disease epidemic", "disease outbreak", "epidemic prevention", "epidemic control"],
    wordFamily: ["epidemiological", "epidemiology"]
  }
];

export const getPresetWords = (): WordItem[] => {
    return PRESET_WORDS.map(w => createNewWord(w));
}
