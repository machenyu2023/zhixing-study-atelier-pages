import { writeFile } from "node:fs/promises";

const output = new URL("../data/question-banks/ielts-original-bank.json", import.meta.url);
const READING_URL = "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading";
const LISTENING_URL = "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening";
const WRITING_URL = "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing";
const OVERVIEW_URL = "https://ielts.org/take-a-test/test-types/ielts-academic-test";
const SOURCE = "Project-original practice; format informed by the IELTS official test description";
const LICENSE = "Project Original - personal study use";

const readingSets = [
  {
    slug: "oyster-reefs",
    topic: "Oyster reef restoration",
    passage: `Along many temperate coasts, oyster reefs once formed dense ridges that altered currents and provided shelter for juvenile fish. Harvesting, pollution and disease reduced many of these structures to scattered shells. Restoration teams initially responded by placing fresh oyster larvae on flat beds of recycled shell. The approach looked efficient on paper, yet survival was often poor because sediment buried young oysters and low-oxygen water settled close to the seabed.

A newer strategy treats reef height as an engineering variable. In one estuary programme, researchers built ridges at three elevations and monitored them through two summers. Oysters on the tallest ridges experienced stronger flow, which delivered food and carried away fine sediment. Their survival exceeded that on the lowest structures. However, height alone did not explain every result. Ridges exposed to heavy boat wakes lost shell from their edges, while sheltered ridges remained stable.

The programme also changed how success was measured. Earlier projects counted living oysters after one year. The estuary team added indicators such as the number of fish species using the reef, the rate at which the structure trapped rather than released sediment, and whether new generations of oysters settled without further human assistance. These measures made the projects slower to evaluate, but they revealed whether a reef had begun to function as an ecosystem rather than as a collection of planted animals.

Managers now favour several modest ridges in different locations over one large installation. This spreads the risk from storms and local water-quality failures. It also means that a design can be adjusted as evidence accumulates, an advantage in estuaries where conditions vary sharply over short distances.`,
    heading: "Why reef structure and broader measures both matter",
    headingDistractors: ["Replacing fisheries with laboratory oyster farms", "A universal design for every coastal habitat", "Why boat traffic always improves oyster survival"],
    mainIdea: "Effective oyster restoration combines physical design, ecological monitoring and risk spreading.",
    mainDistractors: ["Recycled shell should no longer be used in marine projects.", "Oyster survival depends entirely on the height of a reef.", "The main purpose of restored reefs is commercial harvesting."],
    detailQuestion: "Why did oysters on the tallest experimental ridges generally survive better?",
    detailAnswer: "Stronger flow supplied food and removed fine sediment.",
    detailDistractors: ["They were protected from every boat wake.", "They received additional larvae each month.", "Their shells were harvested less frequently."],
    inference: "A project with many oysters after one year may still fail to become self-sustaining.",
    inferenceDistractors: ["Fish diversity can be measured only after a decade.", "Low ridges are always cheaper than high ridges.", "Storms affect all sites in an estuary equally."],
    vocabWord: "modest",
    vocabAnswer: "limited in size",
    vocabDistractors: ["poorly documented", "financially profitable", "recently completed"],
    tfngStatement: "The estuary team found that reef height accounted for all differences in oyster survival.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The passage explicitly says that height did not explain every result and describes the effect of boat wakes.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: The tallest ridges benefited from stronger flow, while several smaller sites reduced the risk from storms and local water-quality _____.",
    summaryAnswers: ["failures"],
    summaryExplanation: "The final paragraph refers to spreading the risk from storms and local water-quality failures.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What could bury young oysters on flat shell beds?",
    shortAnswers: ["sediment", "fine sediment"],
    shortExplanation: "The first paragraph states that sediment buried young oysters."
  },
  {
    slug: "heat-mapping",
    topic: "Urban heat mapping",
    passage: `City temperature maps are often produced from satellite images. These images are valuable because they cover an entire metropolitan area at once, but they record the temperature of roofs, roads and vegetation rather than the air people actually breathe. They may also pass over a city only once every few days. A clear image taken in the morning can therefore miss a neighbourhood that becomes dangerously hot after sunset.

To fill this gap, several councils have recruited residents to carry small sensors along fixed routes. Volunteers travel at agreed times by bicycle or on foot, recording air temperature and humidity at street level. The resulting maps reveal sharp differences within a single satellite pixel. A shaded lane beside mature trees may be several degrees cooler than an exposed bus stop only a short walk away.

Community mapping is not automatically reliable. Sensors carried inside bags respond slowly, and routes completed at different speeds cannot be compared directly. Organisers therefore attach sensors to the outside of identical cases, provide a target pace and repeat each route on several days. They also retain unusual readings instead of deleting them immediately. A sudden cool point may indicate an error, but it may also identify a leaking water main or an unexpectedly effective pocket park.

The most useful outcome is not a more colourful map but a better decision. One council combined the measurements with data on age, housing quality and access to public space. It then moved evening cooling centres closer to the blocks where high night-time temperatures overlapped with vulnerable populations. Tree planting remained part of the plan, but the maps showed where shade was needed now and where long-term canopy growth would have the greatest social value.`,
    heading: "From remote images to street-level heat decisions",
    headingDistractors: ["Why satellites should be removed from climate research", "The commercial market for personal weather sensors", "A history of bicycle planning in large cities"],
    mainIdea: "Street-level measurements can complement satellite data and direct heat protection to vulnerable places.",
    mainDistractors: ["Volunteer data are more accurate than professional data in every situation.", "The only effective response to urban heat is immediate tree planting.", "Night-time temperatures are uniform within each satellite pixel."],
    detailQuestion: "What did volunteers do to make their measurements more comparable?",
    detailAnswer: "They used standard sensor cases, followed a target pace and repeated routes.",
    detailDistractors: ["They carried sensors inside insulated bags.", "They selected a different route on every journey.", "They removed every unusual reading before analysis."],
    inference: "An apparently abnormal reading can sometimes reveal a real local feature.",
    inferenceDistractors: ["Satellite images cannot measure roof temperatures.", "Cyclists always record lower temperatures than walkers.", "Cooling centres are useful only during daylight hours."],
    vocabWord: "retain",
    vocabAnswer: "keep",
    vocabDistractors: ["explain", "average", "publish"],
    tfngStatement: "The council used demographic and housing information alongside temperature measurements.",
    tfngAnswer: "TRUE",
    tfngExplanation: "The final paragraph says the council combined the measurements with age, housing-quality and public-space data.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Satellite images measure surfaces, whereas volunteers record air conditions at _____ level.",
    summaryAnswers: ["street"],
    summaryExplanation: "The volunteer programme records air temperature and humidity at street level.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Which facilities were moved nearer to the hottest vulnerable blocks?",
    shortAnswers: ["cooling centres"],
    shortExplanation: "The council moved evening cooling centres closer to the relevant blocks."
  },
  {
    slug: "seed-banks",
    topic: "Seed banks and crop diversity",
    passage: `Seed banks are frequently described as vaults in which agricultural diversity can be frozen in time. The image is useful but incomplete. Seeds remain alive while stored, and even under cold, dry conditions their ability to germinate gradually declines. Curators must periodically remove a sample, grow the plants and collect a fresh generation of seed. This process, known as regeneration, creates opportunities for both rescue and loss.

If too few plants are grown, rare genetic variants may disappear simply by chance. If related varieties flower together, accidental cross-pollination can alter the collection. Curators reduce these risks by using minimum population sizes, separating plots and recording the origin of every harvested batch. Species that are pollinated by insects may require mesh enclosures and managed pollinators.

Storage also favours certain crops. Wheat and many beans produce seeds that tolerate drying and low temperatures. Cocoa and several tropical fruits produce so-called recalcitrant seeds, which are damaged by the same treatment. Their diversity must be maintained in field collections or as tissue grown under controlled laboratory conditions. Both alternatives demand regular care and are vulnerable to equipment failure, pests or extreme weather.

For farmers, the value of a bank becomes visible when stored material is actively used. Breeders may screen old varieties for disease resistance, while communities may request seed that disappeared after a flood or a shift in markets. Such requests require accurate records: a packet labelled only with a crop name is far less useful than one linked to its location, growing conditions and local uses. Modern seed banking is therefore not passive storage. It is a continuing cycle of biological maintenance, documentation and exchange.`,
    heading: "Why conserving seed is an active process",
    headingDistractors: ["The case for replacing farms with frozen vaults", "Why tropical crops contain little genetic diversity", "A single storage method for all plant species"],
    mainIdea: "Seed conservation requires repeated biological care, suitable methods and detailed records.",
    mainDistractors: ["Cold storage preserves every seed indefinitely.", "Cross-pollination is desirable during all regeneration work.", "Seed banks are useful only to commercial plant breeders."],
    detailQuestion: "Why can regeneration reduce genetic diversity?",
    detailAnswer: "A small group of plants may lose rare variants by chance.",
    detailDistractors: ["Cold rooms create new plant diseases.", "Curators always mix unrelated crop species.", "Freshly collected seed cannot be documented."],
    inference: "A seed packet without information about its origin has limited practical value.",
    inferenceDistractors: ["All recalcitrant seeds can be dried after one generation.", "Field collections require no protection from weather.", "Farmers rarely use material stored in seed banks."],
    vocabWord: "passive",
    vocabAnswer: "not involving active intervention",
    vocabDistractors: ["commercially unsuccessful", "genetically uniform", "protected by law"],
    tfngStatement: "Cocoa seeds can be conserved using exactly the same drying process as wheat seeds.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The passage states that cocoa produces recalcitrant seeds damaged by the treatment tolerated by wheat.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Growing stored seed to collect a fresh generation is called _____.",
    summaryAnswers: ["regeneration"],
    summaryExplanation: "The first paragraph defines this process as regeneration.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What may insect-pollinated species need inside mesh enclosures?",
    shortAnswers: ["managed pollinators", "pollinators"],
    shortExplanation: "The passage says such species may require mesh enclosures and managed pollinators."
  },
  {
    slug: "electric-buses",
    topic: "Electric buses and street noise",
    passage: `Electric buses are usually promoted for reducing exhaust emissions, but their effect on city sound is more complicated than the simple removal of an engine. At low speeds, a diesel bus is often dominated by engine vibration and cooling fans. An electric vehicle can be much quieter. At higher speeds, however, tyre contact with the road and air movement become the main sources of sound, so the difference between power systems narrows.

Researchers in one transport corridor placed microphones at stops, intersections and open sections of road. Average sound levels fell after electric buses were introduced, particularly where vehicles accelerated from rest. Yet passengers did not report an equally large improvement everywhere. At busy stops, warning beeps, door mechanisms and multiple conversations remained prominent. Some pedestrians with limited vision also found the quieter approach of a bus difficult to detect.

The operator responded in two ways. It adjusted the artificial warning sound so that its pitch was noticeable near the vehicle without travelling far along the street. It also trained drivers to approach stops smoothly, reducing abrupt braking and the noise of loose interior fittings. These changes show that sound design extends beyond the motor.

There was a further, unexpected effect. Once the loudest engine events disappeared, residents became more aware of delivery vehicles at dawn and motorcycles late at night. Complaints about the corridor did not fall as rapidly as the measured average. The researchers argue that this is not evidence that electrification failed. Rather, it demonstrates that people experience sound as a sequence of identifiable events, while a single average can conceal when and why disturbance occurs.`,
    heading: "Quieter motors do not solve every noise problem",
    headingDistractors: ["Why diesel engines are preferred by pedestrians", "The complete elimination of transport sound", "How bus fares influence residential complaints"],
    mainIdea: "Electric buses reduce some sounds, but perceived noise also depends on speed, other sources and individual events.",
    mainDistractors: ["Artificial warning sounds should be audible across an entire district.", "Average sound measurements perfectly predict public satisfaction.", "Tyre noise matters only when a bus is stationary."],
    detailQuestion: "Where was the reduction in average sound especially noticeable?",
    detailAnswer: "In places where buses accelerated from rest.",
    detailDistractors: ["Only inside bus depots.", "On roads used exclusively by motorcycles.", "At the highest possible travelling speed."],
    inference: "Removing one dominant noise can make other sources seem more noticeable.",
    inferenceDistractors: ["Residents cannot distinguish vehicles by sound.", "Electric buses produce no sound at intersections.", "Delivery traffic increased because of electrification."],
    vocabWord: "prominent",
    vocabAnswer: "easy to notice",
    vocabDistractors: ["technically defective", "pleasant to hear", "strictly regulated"],
    tfngStatement: "Residents' complaints declined at exactly the same rate as the measured average sound level.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The final paragraph says complaints did not fall as rapidly as the measured average.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: At higher speeds, tyre contact and air movement reduce the acoustic difference between power _____.",
    summaryAnswers: ["systems"],
    summaryExplanation: "The first paragraph says the difference between power systems narrows at higher speeds.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Who had difficulty detecting a quieter approaching bus?",
    shortAnswers: ["some pedestrians", "pedestrians"],
    shortExplanation: "Some pedestrians with limited vision found the quieter approach difficult to detect."
  },
  {
    slug: "moth-surveys",
    topic: "Citizen science moth surveys",
    passage: `Moths are useful indicators of ecological change, but monitoring them across a country is expensive. A citizen-science scheme addressed this problem by lending simple light traps to volunteers. Each trap used the same low-powered bulb and was operated for one night per month. In the morning, participants photographed the catch, released the insects and uploaded their records.

The large number of observations created an immediate advantage: the scheme covered gardens, farms and woodland edges that professional teams rarely visited. It also created a statistical difficulty. Volunteers were more likely to set traps on warm, dry nights, when moth activity was already high. A raw count could therefore suggest that populations were stable even if moths were becoming less abundant.

To correct the bias, analysts combined each record with local weather data and information about whether a scheduled survey had been attempted. A night with no trap was treated differently from a completed survey that caught no moths. This distinction allowed the model to separate absence of effort from a genuine zero.

Identification posed another challenge. The scheme initially required every photograph to be checked by an expert, and a growing backlog delayed results. Organisers then introduced a two-stage system. Image software proposed a short list of likely species, and experienced volunteers confirmed common species while specialists reviewed difficult or rare records. The software did not replace human judgement; it directed scarce expertise to the observations where it mattered most.

After six years, the strongest trends came from species that were easy to recognise and appeared regularly. For rare species, the organisers warned against dramatic conclusions. A wider network increases the chance of detecting rarity, but a handful of sightings is still too little evidence for a national trend.`,
    heading: "Turning volunteer moth records into reliable evidence",
    headingDistractors: ["Why rare moths are easy to monitor", "Replacing all insect experts with image software", "A guide to building high-powered garden lights"],
    mainIdea: "Wide volunteer coverage becomes useful only when effort, weather and identification quality are handled carefully.",
    mainDistractors: ["Citizen scientists should collect and preserve every moth they find.", "Warm nights provide an unbiased measure of annual populations.", "Rare-species trends are always clearer than common-species trends."],
    detailQuestion: "Why was a missed survey recorded differently from a survey with zero moths?",
    detailAnswer: "The model needed to distinguish no effort from a genuine zero count.",
    detailDistractors: ["Only zero counts were accompanied by photographs.", "Missed surveys occurred exclusively in woodland.", "The traps could not operate in dry weather."],
    inference: "A very large dataset can still be misleading if survey effort is selective.",
    inferenceDistractors: ["Every moth species can be identified automatically.", "Professional teams routinely visit more gardens than volunteers.", "Releasing moths prevents the use of weather data."],
    vocabWord: "backlog",
    vocabAnswer: "work waiting to be completed",
    vocabDistractors: ["a group of rare insects", "a software error", "a decline in volunteers"],
    tfngStatement: "The image software made all expert review unnecessary.",
    tfngAnswer: "FALSE",
    tfngExplanation: "Specialists continued to review difficult or rare records; software only proposed likely species.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Analysts combined observations with weather data to correct sampling _____.",
    summaryAnswers: ["bias"],
    summaryExplanation: "The passage explicitly describes correcting the bias created by volunteers choosing favourable nights.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Which species produced the strongest trends after six years?",
    shortAnswers: ["common species", "recognisable species", "regular species"],
    shortExplanation: "The strongest trends came from species that were easy to recognise and appeared regularly."
  },
  {
    slug: "peatland-rewetting",
    topic: "Peatland rewetting",
    passage: `Peat forms when waterlogged conditions slow the decomposition of plant material. Over centuries, partly decayed matter accumulates and stores large quantities of carbon. When a peatland is drained for farming or fuel extraction, oxygen enters the soil and decomposition accelerates. Restoring water levels can slow this loss, but rewetting is not an instant return to the original ecosystem.

Engineers commonly block drainage channels with small dams. Water then spreads into the surrounding peat, although its distribution depends on the slope and on cracks created during dry years. If a site is rewetted too quickly, water may flood neighbouring land or carry dissolved organic matter into streams. Project teams therefore raise levels in stages and monitor wells across the site rather than relying on a single measurement near a dam.

Greenhouse-gas accounting adds another complication. Rewetting generally reduces carbon dioxide released by decomposition. In the first years, however, methane emissions can rise as microbes operate without oxygen. Methane is powerful but shorter-lived in the atmosphere than carbon dioxide, so the climate result depends on both the amount and timing of each gas. A project cannot be judged from one gas measured during one season.

Vegetation also changes slowly. Mosses that build peat may return only if water remains close to the surface and nutrient levels are suitable. Some teams spread fragments of moss from healthy donor sites, while others wait for natural colonisation to avoid disturbing those sites. The choice reflects local conditions rather than a universal rule. Successful rewetting is best understood as managed recovery: drainage is reversed quickly, but hydrology, vegetation and carbon balance must be followed for many years.`,
    heading: "Rewetting peat is the start, not the end, of recovery",
    headingDistractors: ["Why all wetlands release identical gases", "A rapid method for producing commercial peat", "The case for draining neighbouring farmland"],
    mainIdea: "Peatland restoration requires staged hydrological work and long-term monitoring of several ecological outcomes.",
    mainDistractors: ["Blocking one drain immediately recreates the original ecosystem.", "Methane is the only gas relevant to peatland projects.", "Moss fragments must be added at every restored site."],
    detailQuestion: "Why are water levels raised in stages?",
    detailAnswer: "Rapid rewetting can flood nearby land or affect streams.",
    detailDistractors: ["Peat decomposes only when water rises slowly.", "Dams cannot hold water for more than one season.", "Staged work prevents all methane production."],
    inference: "A short monitoring period could give a distorted view of the climate effect.",
    inferenceDistractors: ["Drainage channels are unrelated to groundwater.", "Healthy donor sites contain no peat-building moss.", "Carbon dioxide rises whenever oxygen is excluded."],
    vocabWord: "colonisation",
    vocabAnswer: "the establishment of organisms in a place",
    vocabDistractors: ["the legal purchase of land", "the removal of nutrients", "the measurement of gas"],
    tfngStatement: "The passage recommends natural moss colonisation for every peatland project.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The text presents spreading moss and natural colonisation as choices based on local conditions, not a universal rule.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Drained peat decomposes faster because _____ enters the soil.",
    summaryAnswers: ["oxygen"],
    summaryExplanation: "The first paragraph explains that oxygen enters drained soil and decomposition accelerates.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What structures are used to block drainage channels?",
    shortAnswers: ["small dams", "dams"],
    shortExplanation: "Engineers commonly block drainage channels with small dams."
  },
  {
    slug: "scent-archives",
    topic: "Museum scent archives",
    passage: `Museums traditionally preserve objects that can be seen and touched, but smell is increasingly treated as part of cultural heritage. A historic book may carry traces of leather, paper and furniture polish; an industrial workshop may be remembered through oil and hot metal. Curators who attempt to archive such scents face a basic problem: odours are mixtures of volatile compounds that change as objects age.

One method is chemical sampling. Air is drawn from the space around an object through a material that captures volatile molecules. Laboratory analysis then produces a profile of the compounds present at that moment. The profile is precise, yet it is not the smell itself. Concentration, humidity and interaction among compounds influence what a person perceives, and some important molecules may be below the instrument's detection limit.

For this reason, archives also collect human descriptions. Participants may independently choose terms such as dusty, sweet or medicinal and then discuss the memories associated with them. These accounts are subjective, but subjectivity is relevant when the goal is to preserve cultural meaning. The smell of coal smoke, for example, may represent comfort to one generation and pollution to another.

Recreating an odour for an exhibition introduces ethical and practical questions. Synthetic mixtures can help visitors imagine a lost environment, but a reconstruction should not be presented as an exact original. It is an interpretation based on samples, historical recipes and testimony. Curators must also consider allergies and avoid contaminating nearby objects. The emerging practice therefore treats a scent record as a bundle: chemical data, descriptive language, personal context and a transparent account of how any reconstruction was made.`,
    heading: "Preserving smells requires more than chemical data",
    headingDistractors: ["Why museums should perfume every gallery", "A perfect instrument for copying historic odours", "The disappearance of visual museum collections"],
    mainIdea: "Scent archives combine measurement, human interpretation and transparent reconstruction.",
    mainDistractors: ["Human descriptions should replace all laboratory analysis.", "Historic odours remain chemically unchanged over time.", "Synthetic smells can always reproduce an exact original."],
    detailQuestion: "Why is a laboratory compound profile not identical to a perceived smell?",
    detailAnswer: "Perception also depends on concentration, humidity and interactions among compounds.",
    detailDistractors: ["Air cannot be sampled near old objects.", "Laboratories analyse only visible materials.", "People cannot describe unfamiliar smells."],
    inference: "Different generations may attach different meanings to the same odour.",
    inferenceDistractors: ["Every scent reconstruction damages nearby objects.", "Chemical instruments detect all volatile molecules.", "Personal memories make scent archives scientifically useless."],
    vocabWord: "volatile",
    vocabAnswer: "able to evaporate easily",
    vocabDistractors: ["likely to explode", "pleasant to smell", "difficult to identify"],
    tfngStatement: "The passage states that chemical sampling alone captures the full cultural meaning of a scent.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The archive also needs human descriptions and context because chemical profiles are not complete perceived smells.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: A recreated museum odour should be presented as an _____ rather than an exact original.",
    summaryAnswers: ["interpretation"],
    summaryExplanation: "The fourth paragraph explicitly calls a reconstruction an interpretation.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What health issue must curators consider when recreating scents?",
    shortAnswers: ["allergies"],
    shortExplanation: "Curators must consider allergies."
  },
  {
    slug: "warehouse-robots",
    topic: "Cooperative warehouse robots",
    passage: `Early warehouse robots often followed fixed tracks and operated inside fenced areas. Newer mobile machines share aisles with people and with other robots, creating a coordination problem similar to traffic management. Each robot can calculate a short route to its destination, but if every machine selects the locally fastest path, narrow intersections may become congested.

One solution uses a central scheduler. The scheduler receives requests, reserves sections of floor for particular time windows and delays a robot before it enters a crowded area. This produces orderly movement, although communication failure can interrupt the whole fleet. A contrasting approach allows robots to negotiate directly with nearby machines. It is more resilient to the loss of one controller, but local agreements may be inefficient when congestion develops far ahead.

Several warehouses now combine the methods. A central system assigns broad zones and priorities, while robots make small adjustments in response to obstacles. Importantly, the objective is not simply to maximise the number of kilometres travelled or the speed of individual machines. Managers monitor completed orders, energy use and the frequency with which human workers must change direction or stop.

This last measure has altered robot behaviour. A machine that repeatedly passes close to a worker may remain within its technical safety limit yet create stress and slow the person's next movement. Designers therefore include a wider comfort distance and make robots signal their intended direction early. Trials show that slightly slower, more predictable motion can increase the productivity of the mixed team. The result illustrates a general principle: in cooperative systems, optimising every component separately does not necessarily optimise the system as a whole.`,
    heading: "Coordinating robots for the performance of the whole warehouse",
    headingDistractors: ["Why the fastest robot always completes the most orders", "Removing all human workers from shared aisles", "A return to fixed tracks in every warehouse"],
    mainIdea: "Warehouse coordination must balance routing efficiency, resilience and predictable interaction with people.",
    mainDistractors: ["Direct negotiation is always superior to central scheduling.", "Distance travelled is the only useful measure of robot performance.", "A robot is cooperative whenever it remains inside a technical safety limit."],
    detailQuestion: "What does a central scheduler reserve?",
    detailAnswer: "Sections of floor for specified time windows.",
    detailDistractors: ["Individual workers for complete shifts.", "Battery power for nearby buildings.", "Fixed tracks for every mobile machine."],
    inference: "A small reduction in robot speed can improve total team output.",
    inferenceDistractors: ["Human workers prefer robots that change direction without warning.", "Local negotiation eliminates distant congestion.", "Central communication can never fail."],
    vocabWord: "resilient",
    vocabAnswer: "able to continue despite disruption",
    vocabDistractors: ["easy to programme", "expensive to replace", "restricted to one route"],
    tfngStatement: "The combined system gives the central controller every minor obstacle-avoidance decision.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The central system assigns broad zones, while robots make small adjustments around obstacles.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Predictable robot movement can reduce worker stress and improve mixed-team _____.",
    summaryAnswers: ["productivity"],
    summaryExplanation: "The final paragraph says slower, predictable motion can increase mixed-team productivity.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What do robots signal early to nearby workers?",
    shortAnswers: ["intended direction", "their direction", "direction"],
    shortExplanation: "Designers make robots signal their intended direction early."
  },
  {
    slug: "dark-skies",
    topic: "Dark skies and bird migration",
    passage: `Many migratory birds travel at night, using celestial cues and the Earth's magnetic field to maintain direction. Artificial light can interfere with this journey. Brightly lit buildings may attract or disorient birds, particularly when low cloud reflects urban light and hides the stars. Conservation campaigns have therefore encouraged offices to switch off unnecessary lights during peak migration.

The timing of such programmes used to rely on broad seasonal calendars. These were simple to communicate but inefficient: migration can shift by weeks according to temperature and wind. New forecasting systems combine weather models with radar observations of birds in flight. They issue alerts on nights when large movements are expected, allowing buildings to reduce lighting when the benefit is likely to be greatest.

Forecasting does not remove the need for long-term design. A building with downward-facing exterior lights and blinds that limit indoor glare poses less risk throughout the year. Nor does every light have the same effect. Blue-rich white light scatters strongly in the atmosphere, while warmer colours are often less disruptive, although intensity and placement remain important.

Researchers evaluate campaigns by comparing radar movement with reports of birds found around buildings. Interpretation is difficult because fewer reported collisions may reflect lower migration, better lighting or simply reduced search effort. Some cities now train volunteers to follow fixed morning routes and to record a completed search even when no birds are found. As in many conservation projects, a zero is informative only when observers also know that someone looked.`,
    heading: "Using forecasts and design to reduce migration hazards",
    headingDistractors: ["Why all bird migration occurs during cloudy weather", "Replacing radar with informal seasonal calendars", "The economic value of brighter office towers"],
    mainIdea: "Targeted alerts, safer lighting and consistent monitoring can reduce and measure risks to migrating birds.",
    mainDistractors: ["Warm-coloured light is harmless at any intensity.", "Forecasting makes permanent lighting changes unnecessary.", "Collision reports are meaningful without data on search effort."],
    detailQuestion: "Why can a fixed seasonal calendar waste effort?",
    detailAnswer: "Weather can shift the timing of migration by several weeks.",
    detailDistractors: ["Birds migrate only during office hours.", "Radar cannot detect birds in flight.", "Cloud always makes urban areas darker."],
    inference: "Recording an unsuccessful search helps analysts interpret zero collision reports.",
    inferenceDistractors: ["Downward-facing light increases indoor glare.", "The Earth's magnetic field is visible to human observers.", "Every building attracts the same number of birds."],
    vocabWord: "broad",
    vocabAnswer: "general rather than precise",
    vocabDistractors: ["widely disputed", "physically large", "scientifically advanced"],
    tfngStatement: "The forecasting system uses both weather information and radar observations.",
    tfngAnswer: "TRUE",
    tfngExplanation: "The second paragraph states that forecasts combine weather models with radar observations.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Low cloud can reflect city light and conceal the _____.",
    summaryAnswers: ["stars"],
    summaryExplanation: "The first paragraph says low cloud reflects urban light and hides the stars.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Which colour-rich light scatters strongly in the atmosphere?",
    shortAnswers: ["blue-rich light", "blue-rich white"],
    shortExplanation: "The passage identifies blue-rich white light as scattering strongly."
  },
  {
    slug: "lime-mortar",
    topic: "Traditional lime mortar",
    passage: `When old stone buildings are repaired, the material between the stones can be as important as the stones themselves. Many twentieth-century repairs used hard Portland cement because it sets quickly and appears durable. In walls originally built with lime mortar, however, a rigid replacement can concentrate movement and moisture in the softer stone, causing its surface to break away.

Lime mortar behaves differently. It is relatively flexible and allows water vapour to pass through joints. During wet weather, the mortar may absorb moisture; in dry conditions, that moisture can evaporate. The joint acts as a sacrificial element that is easier to replace than carved stone. This does not mean lime is weak in every sense. A suitable mix can remain serviceable for decades while accommodating small seasonal movements.

Selecting a mix requires evidence. Conservators examine surviving mortar to identify the binder, aggregate size and possible additives. They also consider exposure: a sea-facing wall receives different rain and salt loads from an internal partition. Copying a historic recipe without considering the present location may therefore be as misguided as applying a modern cement everywhere.

Workmanship affects the outcome. If joints are filled too deeply in one operation, the surface can dry while the interior remains soft. Mortar also needs protection from rapid drying, heavy rain and frost while it cures. Training projects often construct sample panels before work begins. These panels allow the team to compare colour and texture, test application methods and observe weathering. Their purpose is not to make repair invisible, but to ensure that new work is compatible, legible on close inspection and capable of ageing without damaging the original fabric.`,
    heading: "Matching repair mortar to an old wall",
    headingDistractors: ["Why the hardest cement protects every historic stone", "Making all restoration work completely invisible", "A single lime recipe for every climate"],
    mainIdea: "Compatible mortar depends on material behaviour, site evidence and careful application.",
    mainDistractors: ["Traditional recipes should be copied without modification.", "Lime mortar prevents all water from entering a wall.", "Portland cement is flexible enough for every historic building."],
    detailQuestion: "Why is lime mortar described as a sacrificial element?",
    detailAnswer: "It can take moisture and wear while being easier to replace than stone.",
    detailDistractors: ["It makes carved stone harder over time.", "It is removed after every period of rain.", "It prevents any seasonal movement in the wall."],
    inference: "A technically authentic recipe may still be unsuitable for a particular wall.",
    inferenceDistractors: ["Internal walls receive the greatest salt loads.", "Sample panels are built only after repair is complete.", "Deep joints always cure faster than shallow joints."],
    vocabWord: "legible",
    vocabAnswer: "recognisable on careful inspection",
    vocabDistractors: ["covered with writing", "brighter than the stone", "impossible to distinguish"],
    tfngStatement: "The passage says that lime mortar must be replaced every year.",
    tfngAnswer: "NOT GIVEN",
    tfngExplanation: "The passage says suitable lime mortar can last for decades but gives no yearly replacement requirement.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Conservators study the binder, aggregate and possible _____ in surviving mortar.",
    summaryAnswers: ["additives"],
    summaryExplanation: "The third paragraph lists possible additives among the features examined.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What do training projects build before repairs begin?",
    shortAnswers: ["sample panels", "panels"],
    shortExplanation: "Training projects often construct sample panels before work begins."
  },
  {
    slug: "sleep-memory",
    topic: "Sleep and memory consolidation",
    passage: `Learning does not end when a study session stops. Newly formed memories remain unstable and can be strengthened, reorganised or lost over the following hours. Sleep is associated with this consolidation process, although the common advice to sleep after learning conceals several important distinctions.

Different tasks appear to benefit from different features of sleep. Remembering pairs of unrelated words is often linked to deep, slow-wave sleep, while some perceptual and emotional tasks show associations with rapid eye movement sleep. These patterns are not simple switches: sleep stages repeat in cycles, and performance can depend on the sequence of stages as well as their total duration.

Experiments must also separate sleep from other explanations. A group tested in the evening and again in the morning has slept, but it has also experienced less daytime interference than a group tested morning and evening. Researchers use nap studies, controlled wake periods and tasks presented at different times to reduce this problem. Even then, people who sleep well may differ in stress, health or prior knowledge.

Recent work focuses less on asking whether sleep helps memory and more on what is retained. During consolidation, the brain may preserve the general pattern of an experience while weakening incidental detail. This can support flexible understanding, but it may also produce confident errors when a new item resembles what was learned. Sleep should therefore not be imagined as a recording device that protects every detail. It is an active period in which memories are selected and transformed, and the result depends on the kind of material, the structure of sleep and what the learner encounters afterwards.`,
    heading: "Sleep transforms memories rather than simply storing them",
    headingDistractors: ["Why every memory requires only rapid eye movement sleep", "Eliminating all errors through longer study sessions", "A recording device that preserves complete experience"],
    mainIdea: "Memory consolidation during sleep varies by task and can preserve patterns while altering details.",
    mainDistractors: ["All sleep stages have identical effects on every task.", "Morning test scores prove that sleep caused improvement.", "Consolidation keeps every part of an experience unchanged."],
    detailQuestion: "Why is an evening-to-morning comparison potentially misleading?",
    detailAnswer: "The sleeping group also experiences less daytime interference.",
    detailDistractors: ["Evening participants cannot learn word pairs.", "Morning tests contain fewer questions.", "Sleep stages do not occur in cycles."],
    inference: "Stronger memory for a general pattern can coexist with errors about details.",
    inferenceDistractors: ["Prior knowledge has no relationship with sleep research.", "Nap studies eliminate every possible confounding factor.", "Emotional tasks occur only during deep sleep."],
    vocabWord: "incidental",
    vocabAnswer: "secondary rather than central",
    vocabDistractors: ["emotionally unpleasant", "deliberately repeated", "impossible to remember"],
    tfngStatement: "The passage claims that longer total sleep always produces better memory performance.",
    tfngAnswer: "NOT GIVEN",
    tfngExplanation: "Duration is mentioned as one factor, but no universal claim about longer sleep always improving performance is made.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Researchers use nap studies and controlled wake periods to reduce alternative _____.",
    summaryAnswers: ["explanations"],
    summaryExplanation: "The third paragraph says experiments must separate sleep from other explanations.",
    shortQuestion: "Answer with NO MORE THAN THREE WORDS: Which sleep stage is often associated with unrelated word pairs?",
    shortAnswers: ["slow-wave sleep", "deep slow-wave sleep", "deep sleep"],
    shortExplanation: "Remembering unrelated word pairs is often linked to deep, slow-wave sleep."
  },
  {
    slug: "water-feedback",
    topic: "Household water-use feedback",
    passage: `Water utilities increasingly provide households with digital feedback instead of waiting for a quarterly bill. A display may show litres used in real time, compare the current week with the previous one or send an alert when continuous flow suggests a leak. Although these features share a data source, they influence behaviour in different ways.

Immediate displays make invisible actions visible. A resident can see the effect of a long shower or a running tap, but the novelty may fade after several weeks. Comparative messages can renew attention, especially when households are compared with similar homes rather than with an entire city. Yet poorly chosen comparisons may discourage efficient users: someone already using little water could infer that further care is unnecessary.

Leak alerts have a more direct value. In one pilot, the largest savings came from a small number of properties with faulty toilets or irrigation systems. Average consumption fell substantially even though most participants changed no daily habit. This illustrates why a headline percentage should be interpreted alongside the distribution of individual results.

Utilities also face questions of timing and privacy. A highly detailed pattern can reveal when a home is occupied, so residents need control over data sharing. Messages sent during a drought may be welcomed, whereas frequent alerts in ordinary conditions can cause people to ignore the system. Designers are now testing adaptive feedback: basic summaries for most users, immediate warnings for unusual flow and optional challenges for those who request them. The aim is not maximum information. It is the right information at a moment when a household can act on it.`,
    heading: "Designing water feedback that leads to useful action",
    headingDistractors: ["Why quarterly bills reveal every household leak", "Publishing all household data without consent", "The equal effect of feedback on every resident"],
    mainIdea: "Water-use feedback works differently across households and must balance relevance, timing and privacy.",
    mainDistractors: ["More frequent alerts always produce larger savings.", "Most pilot participants greatly changed their daily habits.", "Comparing every home with the whole city is the fairest method."],
    detailQuestion: "What produced the largest savings in the pilot?",
    detailAnswer: "Repairing serious leaks in a small number of properties.",
    detailDistractors: ["Sending daily messages to every household.", "Replacing all quarterly bills with paper reports.", "Publishing occupancy patterns for researchers."],
    inference: "A large average saving may be driven by a minority of households.",
    inferenceDistractors: ["Real-time data remain equally interesting forever.", "Efficient users always increase consumption after a comparison.", "Privacy concerns disappear during droughts."],
    vocabWord: "adaptive",
    vocabAnswer: "adjusted to different conditions or users",
    vocabDistractors: ["legally compulsory", "available only on paper", "based on annual averages"],
    tfngStatement: "Every household in the pilot changed its daily water-use habits.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The passage states that most participants changed no daily habit.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Continuous water flow may trigger an alert because it suggests a _____.",
    summaryAnswers: ["leak"],
    summaryExplanation: "The first paragraph says continuous flow can suggest a leak.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What can detailed water patterns reveal about a home?",
    shortAnswers: ["occupancy", "when occupied"],
    shortExplanation: "Detailed patterns can reveal when a home is occupied."
  },
  {
    slug: "coral-sound",
    topic: "Sound and coral restoration",
    passage: `A healthy coral reef is not silent. Snapping shrimp, feeding fish and moving water create a complex soundscape that young marine animals can use when selecting habitat. Degraded reefs often sound quieter and less varied. This observation has led researchers to test whether underwater loudspeakers can attract fish to restoration sites.

In field trials, recordings from healthy reefs were played near damaged coral patches for several weeks. More juvenile fish arrived at the sound-treated patches than at silent control sites. Arrival, however, was only the first step. If shelter and food were inadequate, fish soon left or became vulnerable to predators. Acoustic enrichment could guide animals towards a site, but it could not replace the physical recovery of the habitat.

Recording choice also matters. A soundscape from a distant region may contain species or daily rhythms unfamiliar to local fish. Very loud playback can mask natural cues and add another form of pollution. Teams now use local recordings, match playback to appropriate times of day and measure sound at several distances from the speaker.

There is also a risk of measuring the wrong success. A rapid increase in fish numbers looks encouraging, yet concentrating animals in poor habitat could create an ecological trap. Longer studies examine survival, feeding and whether fish contribute to reef processes such as grazing algae. Researchers describe sound as one tool in a sequence: stabilise the reef structure, restore living coral where feasible, reduce local pressures and then use carefully designed acoustic cues to support recolonisation.`,
    heading: "The promise and limits of acoustic reef restoration",
    headingDistractors: ["Replacing coral habitat with permanent loudspeakers", "Why degraded reefs are always completely silent", "Using foreign recordings at maximum volume"],
    mainIdea: "Local reef sounds may attract fish, but habitat quality and long-term outcomes determine restoration success.",
    mainDistractors: ["An increase in arriving fish proves that a reef has recovered.", "Sound treatment can replace food and shelter.", "All reef species respond identically to distant recordings."],
    detailQuestion: "Why did some fish leave sound-treated patches?",
    detailAnswer: "The patches did not provide enough shelter or food.",
    detailDistractors: ["The speakers played only during daylight.", "Healthy reef recordings contained no fish sounds.", "The fish were unable to hear underwater."],
    inference: "Attracting animals to unsuitable habitat could cause harm rather than recovery.",
    inferenceDistractors: ["Local recordings always eliminate sound pollution.", "Fish cannot contribute to algae control.", "Reef structure should be stabilised only after playback."],
    vocabWord: "mask",
    vocabAnswer: "make another sound difficult to detect",
    vocabDistractors: ["record permanently", "translate accurately", "increase in pitch"],
    tfngStatement: "Researchers recommend using local recordings at appropriate times.",
    tfngAnswer: "TRUE",
    tfngExplanation: "The third paragraph says teams use local recordings and match playback to the time of day.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: A site that attracts fish but cannot support them may become an ecological _____.",
    summaryAnswers: ["trap"],
    summaryExplanation: "The final paragraph describes this situation as an ecological trap.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Which animals create sharp sounds on a healthy reef?",
    shortAnswers: ["snapping shrimp", "shrimp"],
    shortExplanation: "The first paragraph identifies snapping shrimp as one source of reef sound."
  },
  {
    slug: "ice-cores",
    topic: "Managing an ice-core archive",
    passage: `Ice cores preserve layers of snowfall that can contain dust, sea salt, volcanic ash and bubbles of ancient air. Because a core is consumed as it is analysed, an archive must decide how much material to provide for current research and how much to reserve for techniques that do not yet exist. This tension has become sharper as drilling reaches older and rarer ice.

Archive managers divide cores lengthwise into working sections and protected sections. Researchers requesting working ice must explain the measurements planned, the amount required and whether several analyses can share the same sample. A proposal that destroys a large volume for a routine measurement may be rejected if a less demanding method is available.

Temperature control is only one part of preservation. Cores can crack when moved between rooms with different temperatures, and labels can detach in frost. Detailed digital records therefore track every segment, its orientation, previous sampling and transport history. Backup power and duplicate catalogues protect against failures that might otherwise make physically intact ice scientifically unusable.

Some archives now maintain an untouched sanctuary core from each major drilling project. The sanctuary is not opened for ordinary requests. Critics argue that withholding material delays useful discoveries, while supporters note that earlier generations could not measure many compounds now studied in tiny samples. The compromise is periodic review. Managers reconsider protected material when a method can answer an important question with minimal consumption. Preservation, in this setting, does not mean refusing all use; it means ensuring that each irreversible use is justified against both present value and future opportunity.`,
    heading: "Balancing present research with the future value of ice cores",
    headingDistractors: ["Why ancient air bubbles should never be studied", "A method for replacing melted ice cores", "Making every archive sample freely available"],
    mainIdea: "Ice-core archives manage an irreplaceable, consumable resource through selective access and detailed records.",
    mainDistractors: ["Temperature alone determines whether an ice core remains useful.", "Sanctuary cores are routinely opened for minor requests.", "Modern methods require more ice than older techniques."],
    detailQuestion: "What information must a researcher include in a request for working ice?",
    detailAnswer: "The planned measurements, required amount and potential for sharing.",
    detailDistractors: ["A promise to use the entire protected section.", "The market price of ancient air.", "A plan to remove all digital labels."],
    inference: "A well-preserved physical sample can lose research value if its history is undocumented.",
    inferenceDistractors: ["Every core contains volcanic ash in each layer.", "Protected material is never reconsidered.", "Moving ice between rooms prevents cracking."],
    vocabWord: "routine",
    vocabAnswer: "standard and regularly performed",
    vocabDistractors: ["experimental and untested", "urgent and dangerous", "secret and unpublished"],
    tfngStatement: "The sanctuary core is available for all ordinary research requests.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The passage states that the sanctuary is not opened for ordinary requests.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Digital records include each segment's orientation, sampling and transport _____.",
    summaryAnswers: ["history"],
    summaryExplanation: "The third paragraph lists the transport history in the digital record.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What kind of power protects the archive from electrical failure?",
    shortAnswers: ["backup power"],
    shortExplanation: "Backup power is listed as protection against failures."
  },
  {
    slug: "fungal-networks",
    topic: "Mycorrhizal fungal networks",
    passage: `Most land plants form associations with mycorrhizal fungi. Fine fungal threads extend through soil and can supply roots with nutrients, while the plant provides the fungus with carbon. Because one fungus may connect with several plants, these associations are often described as underground networks through which resources and signals move.

The network metaphor is productive, but it can encourage claims that go beyond the evidence. In laboratory systems, carbon marked with a traceable isotope has moved from one plant to another through fungal pathways. The amount transferred is usually small, and movement may follow differences in concentration rather than deliberate support by a donor plant. A connected plant may benefit, but benefit alone does not reveal intention.

Field experiments are harder to interpret. Fungal threads are microscopic, roots overlap and compounds can move through soil by other routes. Researchers use mesh barriers that admit fungal threads but exclude roots, together with control barriers that interrupt both. Even this design changes water flow and soil structure, so several controls are required.

Ecological importance also depends on context. A seedling shaded by larger plants might gain carbon through a fungal connection, but it may simultaneously compete with those plants for water. Different fungal species vary in what they exchange and the carbon cost they impose. Rather than treating the network as either a cooperative community or a competitive market, researchers increasingly measure particular transfers under specified conditions. The cautious language is less memorable than the idea of trees communicating, yet it is more useful: it separates observed movement, demonstrated effect and proposed biological function.`,
    heading: "Testing strong claims about underground plant networks",
    headingDistractors: ["Proof that plants intentionally support every neighbour", "Why fungi receive no carbon from plants", "A single fungal species beneath all forests"],
    mainIdea: "Resource movement through fungal links is real, but its scale, cause and ecological meaning require careful tests.",
    mainDistractors: ["Laboratory transfer proves deliberate cooperation among plants.", "Mesh barriers remove every source of experimental uncertainty.", "A connected seedling cannot compete for water."],
    detailQuestion: "Why do field experiments use mesh barriers?",
    detailAnswer: "They can allow fungal threads through while excluding plant roots.",
    detailDistractors: ["They increase the size of fungal threads.", "They prevent all water movement through soil.", "They supply isotope-labelled carbon to plants."],
    inference: "Evidence that carbon moved does not by itself establish why it moved.",
    inferenceDistractors: ["All fungal species impose the same carbon cost.", "Plants connected by fungi never compete.", "Laboratory studies cannot trace carbon."],
    vocabWord: "admit",
    vocabAnswer: "allow to pass through",
    vocabDistractors: ["confess to", "measure precisely", "remove completely"],
    tfngStatement: "The passage says that transferred carbon is always deliberately donated by a plant.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The text warns that movement can follow concentration differences and does not demonstrate intention.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Researchers separate observed movement from demonstrated effect and proposed biological _____.",
    summaryAnswers: ["function"],
    summaryExplanation: "The final sentence lists proposed biological function.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What labelled material helps researchers trace carbon movement?",
    shortAnswers: ["an isotope", "traceable isotope", "isotope"],
    shortExplanation: "The passage describes carbon marked with a traceable isotope."
  },
  {
    slug: "remote-work",
    topic: "Remote work and city centres",
    passage: `Predictions that remote work would empty city centres assumed that office attendance was their main source of activity. In practice, the effects have varied by district and by day of the week. Areas dominated by large offices often lost lunchtime customers, while mixed neighbourhoods with housing, education and entertainment proved more adaptable.

Transaction data show a new weekly rhythm. In many cities, Tuesday to Thursday spending near offices recovered more strongly than Monday or Friday spending. A business that compares only monthly totals may miss this concentration. Cafes have responded by reducing early-week opening hours, offering pre-ordered catering on busy days or targeting residents at weekends.

Transport systems face a related challenge. Lower average passenger numbers do not necessarily mean lower peak demand if commuters choose the same middle days. Some operators have adjusted service schedules, but permanent changes are difficult while employers continue to revise attendance policies. Flexible tickets can suit hybrid workers, although they may also reduce the discount that previously encouraged daily public transport use.

Urban planners argue that resilience depends on reducing single-purpose land use. Converting an office tower into housing sounds straightforward, yet deep floor plans, limited opening windows and plumbing layouts can make conversion costly. Easier changes include allowing classrooms, clinics or cultural uses on lower floors and improving public space for evening activity. The emerging city centre is not simply smaller or larger. It operates on a different timetable and needs a broader mix of reasons for people to visit.`,
    heading: "How hybrid work changes the rhythm and uses of city centres",
    headingDistractors: ["Why every office tower can become cheap housing", "The complete disappearance of weekday travel", "Restoring identical activity on all five working days"],
    mainIdea: "Remote work has concentrated activity on certain days and increased the value of mixed urban uses.",
    mainDistractors: ["Monthly business totals always show daily patterns clearly.", "Passenger peaks disappear whenever average travel falls.", "Office conversion is simple in buildings with deep floors."],
    detailQuestion: "Which days often showed the strongest recovery in spending near offices?",
    detailAnswer: "Tuesday to Thursday.",
    detailDistractors: ["Saturday and Sunday only.", "Monday and Friday.", "Every day equally."],
    inference: "A transit operator can carry fewer weekly passengers while still facing crowded periods.",
    inferenceDistractors: ["Hybrid workers receive larger discounts on every ticket.", "Mixed neighbourhoods depend only on office lunches.", "Employers have fixed permanent attendance policies."],
    vocabWord: "dominated",
    vocabAnswer: "mainly occupied or characterised",
    vocabDistractors: ["legally controlled", "recently constructed", "financially supported"],
    tfngStatement: "The passage states that converting every office tower to housing is inexpensive.",
    tfngAnswer: "FALSE",
    tfngExplanation: "Physical features such as deep floor plans and plumbing can make conversions costly.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Planners associate resilience with less single-purpose land _____.",
    summaryAnswers: ["use"],
    summaryExplanation: "The final paragraph argues for reducing single-purpose land use.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What kind of tickets may suit hybrid workers?",
    shortAnswers: ["flexible tickets"],
    shortExplanation: "The third paragraph says flexible tickets can suit hybrid workers."
  },
  {
    slug: "biochar",
    topic: "Biochar in agricultural soil",
    passage: `Biochar is produced when plant material is heated with little oxygen. The process leaves a carbon-rich solid that decomposes more slowly than the original biomass. Adding it to soil has been proposed as a way to store carbon while improving crop growth, but results vary widely.

The properties of biochar depend on the feedstock and production temperature. Material made from wood at high temperature may contain stable pores but few nutrients. Biochar made from crop residues at lower temperature can release more minerals, yet it may also contain compounds that temporarily inhibit seedlings. Referring to all biochar as a single product therefore hides important differences.

Soil context is equally important. In an acidic, highly weathered soil, some biochars can raise pH and retain nutrients that would otherwise wash away. In a fertile neutral soil, the same addition may produce little yield response. Particle size and application rate influence water movement, and fine material can be lost as dust before it is incorporated.

Long-term trials are needed because early crop growth is not the only outcome. Researchers track whether carbon remains in the soil, whether nitrous oxide emissions change and whether repeated applications affect soil organisms. They also count the emissions from collecting feedstock, heating it and transporting the final material. A project that uses local waste and captures useful heat may have a favourable balance; one that transports bulky biomass over long distances may not. Biochar is thus better viewed as a family of materials within a specific production system, not as a universal soil remedy.`,
    heading: "Why the effects of biochar depend on material and context",
    headingDistractors: ["A universal recipe for doubling every crop yield", "Why fertile soils are always acidic", "Transporting biomass as far as possible"],
    mainIdea: "Biochar outcomes vary with production, soil, application and the emissions of the full system.",
    mainDistractors: ["Every biochar supplies a large quantity of nutrients.", "Early seedling growth is sufficient to judge climate value.", "High-temperature wood biochar decomposes immediately."],
    detailQuestion: "Where might biochar produce little improvement in yield?",
    detailAnswer: "In soil that is already fertile and neutral.",
    detailDistractors: ["Only in highly weathered acidic soil.", "Where local waste is used as feedstock.", "Whenever the material contains stable pores."],
    inference: "Two biochars applied at the same rate may have different effects.",
    inferenceDistractors: ["Transport emissions are unrelated to climate balance.", "Fine biochar cannot be moved by air.", "Soil organisms respond only during the first week."],
    vocabWord: "feedstock",
    vocabAnswer: "raw material used in production",
    vocabDistractors: ["food supplied to livestock", "fertiliser added after planting", "equipment used to measure emissions"],
    tfngStatement: "The passage recommends biochar as a universal remedy for all soils.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The conclusion explicitly rejects treating biochar as a universal soil remedy.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Biochar produced at lower temperatures may contain compounds that temporarily _____ seedlings.",
    summaryAnswers: ["inhibit"],
    summaryExplanation: "The second paragraph says some compounds can temporarily inhibit seedlings.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: Which greenhouse gas besides carbon dioxide is monitored in long-term trials?",
    shortAnswers: ["nitrous oxide"],
    shortExplanation: "Researchers track changes in nitrous oxide emissions."
  },
  {
    slug: "pollen-archives",
    topic: "Pollen evidence in archaeology",
    passage: `Pollen grains have resistant outer walls and can survive for thousands of years in waterlogged sediment. Different plant groups produce distinct forms, so pollen recovered from lake beds, ditches or buried soils can help reconstruct past environments. The method is powerful, but a pollen diagram is not a direct photograph of ancient vegetation.

Plants release very different quantities of pollen. Wind-pollinated trees may produce vast clouds that travel many kilometres, whereas insect-pollinated herbs release less and are often under-represented. A high percentage of pine pollen at a site does not necessarily mean that pine grew beside it. Analysts compare modern pollen rain with known vegetation to estimate these biases.

The source of the sediment also matters. A lake may collect a regional signal, while a small sealed ditch reflects more local plants. Sediment can be disturbed by burrowing animals or later digging, mixing grains from different periods. Researchers therefore examine the layers, date associated material and look for abrupt changes that could indicate disturbance.

Interpretation is strongest when several kinds of evidence agree. A decline in tree pollen accompanied by cereal pollen, charcoal and farming tools may support a case for woodland clearance and cultivation. Any one indicator alone has alternatives: charcoal can come from a natural fire, and cereal-type pollen can resemble that of wild grasses. Archaeologists use pollen to narrow explanations rather than to name a complete landscape with certainty. Its value lies in a structured comparison between samples, contexts and competing accounts of how a place changed.`,
    heading: "Reading pollen as evidence rather than a literal picture",
    headingDistractors: ["Why every pollen grain travels the same distance", "Naming ancient landscapes with complete certainty", "Replacing archaeological tools with lake sediment"],
    mainIdea: "Pollen can reconstruct environmental change when production bias, sediment context and other evidence are considered.",
    mainDistractors: ["Pine pollen always proves that pine grew next to a sample.", "Small ditches provide only regional information.", "Charcoal alone establishes deliberate woodland clearance."],
    detailQuestion: "Why may insect-pollinated herbs be under-represented?",
    detailAnswer: "They generally release less pollen than wind-pollinated plants.",
    detailDistractors: ["Their pollen walls decay immediately.", "They grow only beside deep lakes.", "Analysts remove them from all samples."],
    inference: "Agreement among independent indicators strengthens an environmental interpretation.",
    inferenceDistractors: ["Burrowing animals always improve sediment order.", "Cereal pollen is never confused with wild grass pollen.", "Modern pollen rain cannot inform ancient studies."],
    vocabWord: "sealed",
    vocabAnswer: "closed off from later material",
    vocabDistractors: ["covered in tree pollen", "chemically preserved", "located below a lake"],
    tfngStatement: "The passage says that a large quantity of pine pollen proves nearby pine woodland.",
    tfngAnswer: "FALSE",
    tfngExplanation: "Pine pollen can travel far, so a high percentage does not necessarily indicate nearby pine.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Later digging and animal activity can _____ sediment from different periods.",
    summaryAnswers: ["mix"],
    summaryExplanation: "The third paragraph says disturbance can mix grains from different periods.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What is compared with known vegetation to estimate pollen bias?",
    shortAnswers: ["modern pollen rain", "pollen rain"],
    shortExplanation: "Analysts compare modern pollen rain with known vegetation."
  },
  {
    slug: "modular-schools",
    topic: "Modular school buildings",
    passage: `Modular construction moves much of the building process from a site to a factory. Rooms or structural sections are manufactured under cover, transported and assembled on prepared foundations. For schools that need extra space before a new academic year, the shorter on-site programme is attractive.

Speed does not mean that design decisions can be postponed. Module dimensions are constrained by road transport, and late changes to corridors or services can affect many repeated units. Successful projects settle room layouts, ventilation routes and connection details early. The factory and site teams also need a shared tolerance system: a precisely built module will not fit a foundation that follows a different measurement standard.

Factory production can improve consistency and reduce weather delays. It may also reduce waste because cutting patterns are repeated. However, environmental claims depend on more than the factory. Transporting large modules requires specialised vehicles, and a design that cannot be adapted may be replaced sooner than a conventional building.

Some schools now order modules with removable internal walls and accessible service zones. A classroom can later become two seminar rooms, and damaged finishes can be replaced without disturbing the structure. Post-occupancy studies have highlighted another issue: acoustics at the joints between modules. Small gaps can transmit sound even when each unit performs well in a laboratory test. Designers have responded with continuous seals and on-site testing after assembly. Modular construction therefore shifts work rather than eliminating it. Quality depends on early coordination, accurate interfaces and evidence from the completed building.`,
    heading: "The coordination behind successful modular schools",
    headingDistractors: ["Why factory construction removes the need for site testing", "Transporting classrooms without dimensional limits", "Postponing every design choice until assembly"],
    mainIdea: "Modular schools can be fast and consistent, but require early decisions, adaptable design and careful interfaces.",
    mainDistractors: ["Factory-made units always have a lower environmental impact.", "Laboratory acoustic performance guarantees quiet joints.", "Repeated units allow unlimited late layout changes."],
    detailQuestion: "Why do factory and site teams need a shared tolerance system?",
    detailAnswer: "Modules and foundations must align when they are assembled.",
    detailDistractors: ["Road vehicles use the same foundations as classrooms.", "Internal walls cannot be removed after construction.", "Factory workers perform all post-occupancy studies."],
    inference: "A modular building's lifespan can affect whether its environmental claim is convincing.",
    inferenceDistractors: ["Specialised vehicles eliminate transport emissions.", "Weather delays are greater inside a factory.", "Every acoustic gap is visible before assembly."],
    vocabWord: "tolerance",
    vocabAnswer: "an allowed limit of dimensional variation",
    vocabDistractors: ["acceptance of noisy classrooms", "resistance to bad weather", "time available for transport"],
    tfngStatement: "The passage reports that small joint gaps can transmit sound.",
    tfngAnswer: "TRUE",
    tfngExplanation: "The final paragraph explicitly identifies sound transmission through small gaps at module joints.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Repeated cutting patterns in a factory may reduce construction _____.",
    summaryAnswers: ["waste"],
    summaryExplanation: "The third paragraph says repeated cutting patterns may reduce waste.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What kind of walls allow rooms to be reconfigured?",
    shortAnswers: ["removable walls", "removable internal walls", "internal walls"],
    shortExplanation: "Some modules use removable internal walls."
  },
  {
    slug: "language-radio",
    topic: "Community radio and language revival",
    passage: `When a language has few fluent speakers, a weekly radio programme may seem modest compared with formal schooling. Community stations, however, can place the language in kitchens, vehicles and workplaces, making it part of ordinary life rather than only a classroom subject.

Early programmes often relied on elder speakers reading prepared announcements. Their pronunciation provided an important model, but younger listeners sometimes found the style distant. Producers began recording conversations about sport, food and local events, pairing fluent elders with younger presenters. Mistakes were not edited out automatically; selected errors became short teaching moments, provided the speaker agreed.

Broadcasting creates a demand for new vocabulary. Presenters discussing mobile applications or environmental policy must decide whether to borrow a term, revive an older word or create a new expression. A language committee can offer guidance, yet a term survives only if speakers use it. Radio gives proposed words repeated public exposure and allows listeners to respond.

Measuring impact remains difficult. Audience numbers indicate reach, not language learning. Some stations invite listeners to send voice messages, run follow-up conversation groups and track whether new terms appear outside the programme. These indicators still cannot isolate radio from school courses or family use. The strongest claim is therefore not that broadcasting alone restores fluency. It expands the situations in which the language is heard, gives learners low-pressure opportunities to participate and creates an audible record of change. In revival work, that broader social presence can support, but not replace, sustained teaching and conversation.`,
    heading: "How radio can widen the social life of a language",
    headingDistractors: ["Why audience totals prove complete fluency", "Replacing elder speakers with imported programmes", "Preventing languages from developing new vocabulary"],
    mainIdea: "Community radio supports language revival by normalising use, developing terms and inviting participation alongside teaching.",
    mainDistractors: ["Broadcasting alone can restore full fluency.", "Prepared announcements are the only useful radio format.", "New words survive whenever a committee approves them."],
    detailQuestion: "Why were younger presenters paired with fluent elders?",
    detailAnswer: "To combine strong language models with more accessible conversation.",
    detailDistractors: ["To remove every mistake before broadcasting.", "To replace local topics with formal policy speeches.", "To prevent listeners from sending voice messages."],
    inference: "Public repetition can help test whether newly proposed terms are adopted.",
    inferenceDistractors: ["Audience numbers directly measure individual learning.", "Radio makes family language use unnecessary.", "All borrowed words are rejected by committees."],
    vocabWord: "modest",
    vocabAnswer: "limited in scale",
    vocabDistractors: ["embarrassing to speakers", "expensive to produce", "traditional in style"],
    tfngStatement: "The passage claims that radio can replace sustained teaching.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The conclusion says radio can support but not replace sustained teaching and conversation.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Listener numbers show the programme's reach but do not prove language _____.",
    summaryAnswers: ["learning"],
    summaryExplanation: "The fourth paragraph says audience numbers indicate reach, not language learning.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What can listeners send to some stations?",
    shortAnswers: ["voice messages"],
    shortExplanation: "Some stations invite listeners to send voice messages."
  },
  {
    slug: "green-roofs",
    topic: "Monitoring green roofs",
    passage: `Green roofs are installed for several reasons: to slow storm-water runoff, provide habitat and reduce heat entering buildings. Because these benefits are often discussed together, a roof can be labelled successful without anyone specifying which outcome was expected.

Water retention depends on substrate depth, plant cover and how wet the roof was before a storm. A shallow roof may capture most of a light shower but little of a second storm that arrives before it dries. Researchers therefore report both the proportion retained and the total rainfall, rather than one percentage in isolation.

Temperature measurements require similar care. Sensors beneath a planted roof may show lower daytime peaks than those beneath bare membrane, yet irrigation water and shading from nearby structures can influence the comparison. Annual energy savings also depend on insulation already present in the building. A visible reduction in roof-surface temperature does not translate directly into the same reduction in electricity use.

Biodiversity is sometimes assessed by counting all insects found during a single visit. This favours abundant, mobile species and misses seasonal change. Longer surveys compare planted roofs with nearby ground-level habitats and record whether insects are feeding, nesting or merely passing over. These distinctions have practical consequences. If the aim is to support native pollinators, flower choice and continuity across seasons may matter more than the total number of species observed on one summer day. Monitoring is most useful when it begins with an explicit objective, selects a measure tied to that objective and records the conditions that could alter the result.`,
    heading: "Matching green-roof measurements to stated goals",
    headingDistractors: ["Why every green roof delivers identical benefits", "Counting insects once as a complete biodiversity survey", "Removing insulation from planted buildings"],
    mainIdea: "Green-roof performance must be evaluated with goal-specific measures and relevant context.",
    mainDistractors: ["A retention percentage is meaningful without rainfall totals.", "Surface cooling equals the same percentage of energy savings.", "The total insect count is always the best pollinator measure."],
    detailQuestion: "Why might a roof retain less water during a second storm?",
    detailAnswer: "Its substrate may still be wet from the first storm.",
    detailDistractors: ["Plant cover disappears after every shower.", "Researchers remove the roof between storms.", "Deeper substrate cannot store water."],
    inference: "The same green roof can perform well against one objective and poorly against another.",
    inferenceDistractors: ["Irrigation never affects roof-temperature comparisons.", "Insects found on roofs always nest there.", "Existing building insulation has no energy effect."],
    vocabWord: "continuity",
    vocabAnswer: "uninterrupted availability over time",
    vocabDistractors: ["a large number of species", "connection to the ground", "measurement after rainfall"],
    tfngStatement: "A one-day insect survey captures all seasonal changes on a green roof.",
    tfngAnswer: "FALSE",
    tfngExplanation: "The passage criticises a single visit because it misses seasonal change.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: A roof's ability to retain water partly depends on substrate depth and plant _____.",
    summaryAnswers: ["cover"],
    summaryExplanation: "The second paragraph lists substrate depth and plant cover.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What should monitoring begin with?",
    shortAnswers: ["an explicit objective", "explicit objective", "an objective"],
    shortExplanation: "The final sentence says monitoring should begin with an explicit objective."
  },
  {
    slug: "digital-twins",
    topic: "Digital twins for bridges",
    passage: `A digital twin is a computer representation that is updated with information from a physical asset. For a bridge, the model may combine design drawings, inspection records and readings from strain, vibration and temperature sensors. The phrase sometimes suggests a perfect live copy, but every twin is selective: it represents features chosen for a particular decision.

Sensors do not remove uncertainty. Temperature can change the length and stiffness of bridge components, producing signals that resemble damage. Instruments drift, communication fails and a sensor records only its own location. Engineers establish a baseline across seasons and compare multiple measurements before issuing an alert.

The most useful models connect a detected change to an action. A small shift in vibration frequency might trigger a targeted visual inspection rather than an immediate closure. If inspection confirms cracking, the model can help compare repair options and predict how traffic restrictions would alter loads. This decision chain matters more than a dashboard with a large quantity of unexplained data.

Digital records can also outlast the software that created them. Bridge owners therefore need open formats, documented assumptions and a plan for replacing sensors. Cybersecurity is part of maintenance because false data or unavailable systems could lead to poor decisions. A twin should be judged by whether it improves inspection and intervention over the life of the bridge, not by how closely its animation resembles reality. The objective is an evidence-based management tool, not a visually complete duplicate.`,
    heading: "Building a bridge model that supports decisions",
    headingDistractors: ["Creating a perfect visual duplicate without inspections", "Why one sensor can identify every type of damage", "Closing bridges whenever temperature changes"],
    mainIdea: "A bridge digital twin is valuable when selective data, uncertainty and long-term maintenance lead to appropriate action.",
    mainDistractors: ["More dashboard data automatically improve bridge safety.", "Sensor readings are unaffected by seasons.", "The visual realism of a model is its primary measure of success."],
    detailQuestion: "Why do engineers establish a seasonal baseline?",
    detailAnswer: "Normal temperature effects can resemble structural damage.",
    detailDistractors: ["Design drawings change with the weather.", "Sensors measure only traffic speed.", "Seasonal data eliminate the need for inspections."],
    inference: "A model can remain visually impressive while offering little management value.",
    inferenceDistractors: ["Targeted inspections always require bridge closure.", "Open data formats make cybersecurity unnecessary.", "A vibration shift proves that cracking is present."],
    vocabWord: "drift",
    vocabAnswer: "gradually become less accurate",
    vocabDistractors: ["move to another location", "transmit data faster", "respond to traffic"],
    tfngStatement: "The passage says that every vibration change should cause an immediate bridge closure.",
    tfngAnswer: "FALSE",
    tfngExplanation: "A small vibration change may trigger a targeted inspection, not an immediate closure.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Long-term bridge owners need open formats and documented model _____.",
    summaryAnswers: ["assumptions"],
    summaryExplanation: "The fourth paragraph calls for open formats and documented assumptions.",
    shortQuestion: "Answer with NO MORE THAN TWO WORDS: What type of inspection may follow a small frequency shift?",
    shortAnswers: ["visual inspection", "targeted visual inspection"],
    shortExplanation: "The passage gives a targeted visual inspection as the initial response."
  },
  {
    slug: "cool-storage",
    topic: "Community cool storage for food",
    passage: `Small farmers in hot regions can lose vegetables between harvest and sale because field heat accelerates water loss and decay. Mechanical refrigeration is effective, but a private cold room may be too costly and can sit partly empty outside the owner's harvest period. Shared cool-storage hubs attempt to spread both capacity and expense.

Management is as important as temperature. Produce entering the room must be recorded, labelled and collected on time. Crops also have different requirements: tomatoes can be damaged by temperatures that suit leafy vegetables, while fruit producing ethylene can speed the ageing of nearby crops. Some hubs use separate zones; others publish a restricted list of compatible produce.

Payment design affects who benefits. A monthly subscription favours regular large users, whereas a fee per crate is accessible to occasional farmers but creates more administrative work. In one cooperative, members contributed labour to cleaning and record keeping in exchange for reduced fees. This increased participation but required clear rules when a member missed a shift.

Energy systems introduce another trade-off. Solar panels can match daytime cooling demand, yet storage is still needed overnight and during cloudy weather. Thick insulation and rapid pre-cooling reduce the energy required later. Operators monitor not only electricity use but also the amount of produce sold rather than discarded. A hub that consumes more power than a household refrigerator may still be efficient if it protects many times more food. Evaluation must therefore use a meaningful unit, such as energy per kilogram successfully marketed, and include the reliability of the service as well as its technical performance.`,
    heading: "The operational choices behind shared food cooling",
    headingDistractors: ["Why every crop needs the same storage temperature", "Replacing all produce markets with private cold rooms", "Measuring efficiency only by total electricity use"],
    mainIdea: "Shared cooling succeeds through compatible storage, fair management and performance measures tied to food saved.",
    mainDistractors: ["A monthly subscription is equally suitable for every farmer.", "Solar panels remove the need for overnight energy storage.", "Technical temperature control is the only management challenge."],
    detailQuestion: "Why may tomatoes and leafy vegetables need different zones?",
    detailAnswer: "A temperature suitable for leaves can damage tomatoes.",
    detailDistractors: ["Tomatoes require ethylene from every other fruit.", "Leafy vegetables are never labelled.", "Tomatoes are collected only at night."],
    inference: "Higher total electricity use does not necessarily mean lower efficiency.",
    inferenceDistractors: ["Farmers always prefer subscriptions to per-crate fees.", "Insulation increases later cooling demand.", "Shared hubs remain empty outside one owner's harvest."],
    vocabWord: "compatible",
    vocabAnswer: "able to be stored together without conflict",
    vocabDistractors: ["grown by the same farmer", "ready for immediate sale", "priced by subscription"],
    tfngStatement: "The cooperative allowed labour contributions to reduce storage fees.",
    tfngAnswer: "TRUE",
    tfngExplanation: "Members could contribute cleaning and record-keeping labour in exchange for reduced fees.",
    summaryQuestion: "Complete the summary with ONE WORD from the passage: Fruit that produces _____ can accelerate the ageing of nearby crops.",
    summaryAnswers: ["ethylene"],
    summaryExplanation: "The second paragraph identifies ethylene as the relevant gas.",
    shortQuestion: "Answer with NO MORE THAN THREE WORDS: What evaluation unit is suggested for energy efficiency?",
    shortAnswers: ["energy per kilogram", "energy per kg"],
    shortExplanation: "The passage proposes energy per kilogram successfully marketed."
  }
];

const listeningSets = [
  {
    slug: "library-card",
    topic: "Library membership enquiry",
    transcript: `LIBRARIAN: Northgate Library, how can I help?
CALLER: I have just moved into the area and I would like to join.
LIBRARIAN: Certainly. Bring a photo ID and one document showing your address. A digital utility bill is fine. Standard membership is free, but there is a refundable twelve-pound deposit if you want to borrow tools from the repair collection.
CALLER: I only need books for now. When are you open late?
LIBRARIAN: On Tuesdays and Thursdays we close at eight. Other weekdays are six, and Saturday is four. We are closed on Sundays.
CALLER: I am especially interested in the local-history room.
LIBRARIAN: That room is on the first floor, opposite the lift. It is open on Thursday evenings, but you must book a desk because there are only six places.
CALLER: Can I scan old maps there?
LIBRARIAN: Yes. Use the overhead scanner, not the flatbed machine. Staff will show you how. The first twenty pages are free; after that it is ten pence per page.
CALLER: Great. Could you spell the name of the person who handles bookings?
LIBRARIAN: It is Ms Kersey, K-E-R-S-E-Y. Email her at localhistory@northgate.example.`,
    formQuestion: "Complete the membership note with ONE WORD: Proof of address may be a digital utility _____.",
    formAnswers: ["bill"], formExplanation: "The librarian says that a digital utility bill is acceptable.",
    detailQuestion: "On which two weekdays does the library close at 8 p.m.?", detailAnswer: "Tuesday and Thursday", detailDistractors: ["Monday and Wednesday", "Thursday and Friday", "Wednesday and Saturday"],
    matchQuestion: "Which facility should the caller use to copy old maps?", matchAnswer: "the overhead scanner", matchDistractors: ["the flatbed machine", "the public printer", "the repair collection"],
    locationQuestion: "Where is the local-history room?", locationAnswer: "On the first floor opposite the lift", locationDistractors: ["On the ground floor beside reception", "On the second floor behind the stairs", "In the basement next to the scanner"],
    noteQuestion: "Complete the note with ONE WORD: The first twenty scanned _____ are free.", noteAnswers: ["pages"], noteExplanation: "The first twenty pages are free.",
    shortQuestion: "Write ONE WORD ONLY: What is the booking officer's surname?", shortAnswers: ["Kersey"], shortExplanation: "The librarian spells the surname K-E-R-S-E-Y."
  },
  {
    slug: "wetland-trip",
    topic: "Wetland field trip briefing",
    transcript: `TUTOR: Before Saturday's wetland survey, I need to confirm the arrangements. Meet outside the science building at 7:15. The coach leaves at 7:30 exactly, not 7:45 as shown on the first notice.
STUDENT: Do we need waterproof trousers?
TUTOR: They are recommended, but strong boots are essential. The centre provides life jackets for the boat section. Bring a packed lunch and a refillable bottle; hot drinks will be available at the visitor centre.
STUDENT: What are the groups doing?
TUTOR: Group A begins at the reed beds, measuring water depth. Group B starts at the eastern hide and counts birds. Group C collects soil samples beside the old footbridge. After lunch, you rotate.
STUDENT: I am in Group B. Should I bring binoculars?
TUTOR: The department has enough binoculars, but bring a pencil. Pens do not write well on damp recording sheets.
STUDENT: When will we return?
TUTOR: We plan to leave the wetland at 4:20 and arrive here by 5:30, although heavy traffic can add twenty minutes. If the trip is cancelled because of severe weather, I will post a message by 6:15 on Saturday morning.`,
    formQuestion: "Complete the trip note with ONE WORD: Students must wear strong _____.", formAnswers: ["boots"], formExplanation: "The tutor says strong boots are essential.",
    detailQuestion: "What time does the coach leave?", detailAnswer: "7:30", detailDistractors: ["7:15", "7:45", "8:00"],
    matchQuestion: "What is Group B's first activity?", matchAnswer: "Counting birds at the eastern hide", matchDistractors: ["Measuring water depth at the reed beds", "Collecting soil by the old footbridge", "Checking life jackets at the visitor centre"],
    locationQuestion: "Where does Group C collect samples?", locationAnswer: "Beside the old footbridge", locationDistractors: ["Inside the visitor centre", "At the eastern hide", "Behind the science building"],
    noteQuestion: "Complete the note with ONE WORD: Use a _____ because ink may fail on damp sheets.", noteAnswers: ["pencil"], noteExplanation: "The tutor recommends a pencil because pens perform poorly on damp sheets.",
    shortQuestion: "Write NO MORE THAN TWO WORDS: What could delay the return journey?", shortAnswers: ["heavy traffic", "traffic"], shortExplanation: "Heavy traffic can add twenty minutes."
  },
  {
    slug: "garden-plot",
    topic: "Community garden plot booking",
    transcript: `COORDINATOR: Riverside Community Garden, this is Maya.
CALLER: I would like to rent a plot. Are any available?
COORDINATOR: The full plots are taken, but two half-plots are free from March. Each is twenty square metres and costs thirty-six pounds for the year.
CALLER: What does the fee include?
COORDINATOR: Water, shared tools and one bag of compost in spring. Seeds are not included. New members attend a safety session on the first Saturday of the month at 10 a.m.
CALLER: Which plot is quieter?
COORDINATOR: Plot H4 is beside the tool shed, so people pass it frequently. H7 is at the northern end, between the pond and the apple trees. It is quieter, though it gets shade after four o'clock.
CALLER: I would prefer H7. Can I grow potatoes?
COORDINATOR: Yes, but no chemical weed killer is allowed. Also, the pond edge is a wildlife strip, so do not cultivate within one metre of it.
CALLER: How do I reserve the plot?
COORDINATOR: Complete the online form and pay a ten-pound holding fee by Friday. The remaining amount is due when you collect the gate key.`,
    formQuestion: "Complete the booking form with ONE WORD: One bag of _____ is included in spring.", formAnswers: ["compost"], formExplanation: "The annual fee includes one bag of compost.",
    detailQuestion: "How much does a half-plot cost for one year?", detailAnswer: "£36", detailDistractors: ["£10", "£20", "£46"],
    matchQuestion: "Which feature applies to plot H7?", matchAnswer: "It becomes shaded after 4 p.m.", matchDistractors: ["It is beside the tool shed.", "It is the busiest plot available.", "It includes free seeds."],
    locationQuestion: "Where is plot H7?", locationAnswer: "Between the pond and the apple trees", locationDistractors: ["Between the gate and the tool shed", "South of the safety room", "Beside the main road"],
    noteQuestion: "Complete the rule with ONE WORD: Chemical weed _____ is prohibited.", noteAnswers: ["killer"], noteExplanation: "The coordinator says no chemical weed killer is allowed.",
    shortQuestion: "Write NO MORE THAN TWO WORDS: What must be paid by Friday?", shortAnswers: ["holding fee", "a holding fee"], shortExplanation: "A ten-pound holding fee is due by Friday."
  },
  {
    slug: "museum-volunteer",
    topic: "Museum volunteer induction",
    transcript: `TRAINER: Welcome to the City Museum volunteer team. Your blue badge gives you access to public galleries, but only staff with a red badge may enter collection stores. Please sign in at reception at the start of every shift.
VOLUNTEER: Where should we leave coats and bags?
TRAINER: Use the lockers in Room 12. It is down the east corridor, just beyond the education studio. Do not leave personal items behind the information desk.
VOLUNTEER: What will we do today?
TRAINER: First, you will practise greeting visitors. After the break, half the group will learn the ticket scanner and the rest will help prepare family activity packs. You will swap after forty minutes.
VOLUNTEER: What if someone asks about an object and I do not know the answer?
TRAINER: Never invent information. Note the gallery and display-case number, then call the duty curator on extension 214. For a lost child or a medical emergency, use extension 200 instead.
VOLUNTEER: Are photographs allowed?
TRAINER: Usually, but flash is prohibited in the textile gallery. Look for the camera symbol with a line through the flash.`,
    formQuestion: "Complete the induction note with ONE WORD: Volunteers must sign in at _____.", formAnswers: ["reception"], formExplanation: "Volunteers sign in at reception at the start of a shift.",
    detailQuestion: "Which badge permits access to collection stores?", detailAnswer: "a red badge", detailDistractors: ["a blue badge", "a visitor sticker", "a camera symbol"],
    matchQuestion: "Which extension should be used for an unanswered object question?", matchAnswer: "214", matchDistractors: ["200", "212", "240"],
    locationQuestion: "Where is Room 12?", locationAnswer: "Beyond the education studio in the east corridor", locationDistractors: ["Behind the information desk", "Inside the textile gallery", "Next to the collection store"],
    noteQuestion: "Complete the instruction with ONE WORD: Record the display-case _____ before calling the curator.", noteAnswers: ["number"], noteExplanation: "The trainer asks volunteers to note the display-case number.",
    shortQuestion: "Write ONE WORD ONLY: What type of photography is banned in the textile gallery?", shortAnswers: ["flash"], shortExplanation: "Flash is prohibited in the textile gallery."
  },
  {
    slug: "research-meeting",
    topic: "Student research project meeting",
    transcript: `SUPERVISOR: Your proposal on reusable cup schemes is clear, but the research question still covers too much.
STUDENT: I planned to compare price discounts, deposit systems and advertising across the whole city.
SUPERVISOR: For a twelve-week project, choose two campus cafés and focus on the deposit system introduced last September. You can compare transactions before and after the change.
STUDENT: The café manager has weekly sales totals.
SUPERVISOR: Useful, but ask for the number of hot drinks as well as reusable-cup returns. Otherwise a fall in total sales could look like a failure of the scheme. Also conduct short interviews, perhaps fifteen customers at each café.
STUDENT: Should I interview staff?
SUPERVISOR: Yes, one manager and two counter staff at each site. They may identify practical problems that transaction data miss.
STUDENT: I was going to send the ethics form next month.
SUPERVISOR: Send it by the 18th of October. You cannot begin interviews until approval arrives. Draft the customer questions this week, pilot them with three students and bring the revised version to our meeting on the 24th.
STUDENT: Should the final report include recommendations?
SUPERVISOR: Two or three, but connect each one directly to your findings.`,
    formQuestion: "Complete the project note with ONE WORD: The study will focus on a cup _____ system.", formAnswers: ["deposit"], formExplanation: "The supervisor narrows the topic to the deposit system.",
    detailQuestion: "How many campus cafés will be compared?", detailAnswer: "two", detailDistractors: ["one", "three", "fifteen"],
    matchQuestion: "Who may reveal problems missing from transaction data?", matchAnswer: "café staff", matchDistractors: ["only the ethics committee", "the three pilot students only", "city transport managers"],
    locationQuestion: "At which sites will the student interview fifteen customers?", locationAnswer: "At each of the two campus cafés", locationDistractors: ["At the supervisor's office", "Across every café in the city", "At the ethics committee meeting"],
    noteQuestion: "Complete the deadline with ONE WORD: Submit the ethics form in _____.", noteAnswers: ["October"], noteExplanation: "The ethics form is due on 18 October.",
    shortQuestion: "Write ONE NUMBER ONLY: How many students will take part in the pilot interview?", shortAnswers: ["3"], shortExplanation: "The questions will be piloted with three students."
  },
  {
    slug: "housing-repair",
    topic: "Student housing maintenance call",
    transcript: `ADVISER: Campus Housing Repairs. What seems to be the problem?
STUDENT: There is water under the kitchen sink in Flat 3B, Calder House.
ADVISER: Is it flowing continuously?
STUDENT: Only when the tap runs. I think the waste pipe is loose.
ADVISER: Please stop using that sink and place a bucket underneath. I can offer a technician tomorrow between 9 and 11, or Thursday from 1 to 3.
STUDENT: Tomorrow morning is fine. The entrance buzzer does not work, so the technician should call me.
ADVISER: I have your number ending 482. Is that correct?
STUDENT: Yes. There is another issue: the extractor fan is very noisy.
ADVISER: I will add it to the same job, but the leak has priority. The technician may need to order a fan part. Do you know the model?
STUDENT: The label says Ventair S60.
ADVISER: Thank you. Your reference is CR-5194. You will receive a text when the technician is on the way. If the leak becomes continuous, close the isolation valve inside the cupboard and call the emergency number.`,
    formQuestion: "Complete the repair form with ONE WORD: Put a _____ under the sink.", formAnswers: ["bucket"], formExplanation: "The adviser tells the student to place a bucket underneath.",
    detailQuestion: "When will the technician visit?", detailAnswer: "Tomorrow between 9 and 11", detailDistractors: ["Today between 9 and 11", "Thursday between 9 and 11", "Tomorrow between 1 and 3"],
    matchQuestion: "Which problem has priority?", matchAnswer: "the leak", matchDistractors: ["the entrance buzzer", "the extractor fan", "the phone number"],
    locationQuestion: "Where is the isolation valve?", locationAnswer: "Inside the cupboard", locationDistractors: ["Beside the entrance buzzer", "Behind the extractor fan", "Outside Calder House"],
    noteQuestion: "Complete the equipment note with ONE WORD: Extractor fan model: Ventair _____.", noteAnswers: ["S60"], noteExplanation: "The model stated is Ventair S60.",
    shortQuestion: "Write ONE WORD AND/OR NUMBERS: What is the repair reference?", shortAnswers: ["CR-5194", "CR5194"], shortExplanation: "The adviser gives the reference CR-5194."
  },
  {
    slug: "conference-booking",
    topic: "Conference registration enquiry",
    transcript: `ORGANISER: Regional Climate Forum, registration desk.
CALLER: I am completing the form and have a few questions.
ORGANISER: Of course. The standard two-day ticket is 140 pounds. Students pay 85 pounds if they upload current identification before 3 May.
CALLER: Does that include the conference dinner?
ORGANISER: Lunch and refreshments are included, but the dinner costs an extra 28 pounds. It will be held at the Harbour Hall, not at the conference centre.
CALLER: I am interested in the workshops.
ORGANISER: Choose one for Friday afternoon. Workshop A is on local heat planning in Room 5. Workshop B covers flood communication in Room 8. Workshop C, on community energy, is in the library seminar room across the courtyard.
CALLER: Is there a poster session?
ORGANISER: Yes, on Saturday at 11:30. Poster titles must be submitted by 12 May, and the final PDF by the 19th.
CALLER: I have a food allergy. Where do I report it?
ORGANISER: Use the access and catering box on page four of the form. Do not put medical details in the public biography section.`,
    formQuestion: "Complete the registration note with ONE WORD: Students must upload current _____.", formAnswers: ["identification", "ID"], formExplanation: "The student rate requires current identification.",
    detailQuestion: "How much does the conference dinner cost?", detailAnswer: "£28", detailDistractors: ["£85", "£112", "£140"],
    matchQuestion: "Which workshop takes place in Room 8?", matchAnswer: "flood communication", matchDistractors: ["local heat planning", "community energy", "poster design"],
    locationQuestion: "Where is the community-energy workshop?", locationAnswer: "In the library seminar room across the courtyard", locationDistractors: ["At Harbour Hall", "In Room 5", "Beside the registration desk"],
    noteQuestion: "Complete the poster deadline with ONE WORD: Submit the final PDF in _____.", noteAnswers: ["May"], noteExplanation: "The final PDF is due on 19 May.",
    shortQuestion: "Write ONE NUMBER ONLY: On which page should an allergy be reported?", shortAnswers: ["4"], shortExplanation: "The access and catering box is on page four."
  },
  {
    slug: "cycling-map",
    topic: "Guided cycling tour briefing",
    transcript: `GUIDE: Before we set off, look at the route map. We leave the visitor centre and follow River Lane east for two kilometres. At the stone bridge, do not cross the river. Turn left onto Mill Path.
RIDER: Is that where the steep hill begins?
GUIDE: No. Mill Path is flat. The climb starts after the old railway tunnel. We will stop before the tunnel to check lights because it is dark inside.
RIDER: Where is the lunch stop?
GUIDE: At Meadow Farm. After the tunnel, take the second right, marked Orchard Road. The farm entrance is opposite a small white church. Please park bikes behind the wooden barn, not beside the café entrance.
RIDER: What happens after lunch?
GUIDE: We continue north to Lake View. The main lakeside track is closed for repairs, so we use the forest path. It is narrow and walkers have priority. Our final stop is the bird tower at the western end of the lake.
RIDER: And if someone gets a puncture?
GUIDE: Stay with your bike and call the support driver. The number is printed in red on the back of your map.`,
    formQuestion: "Complete the route note with ONE WORD: Check bicycle _____ before entering the tunnel.", formAnswers: ["lights"], formExplanation: "The group stops to check lights before the dark tunnel.",
    detailQuestion: "Where does the steep climb begin?", detailAnswer: "After the old railway tunnel", detailDistractors: ["On River Lane", "Before the stone bridge", "At the visitor centre"],
    matchQuestion: "Who has priority on the forest path?", matchAnswer: "walkers", matchDistractors: ["cyclists", "support drivers", "farm vehicles"],
    locationQuestion: "Where should bicycles be parked at Meadow Farm?", locationAnswer: "Behind the wooden barn", locationDistractors: ["Beside the café entrance", "In front of the white church", "Inside the railway tunnel"],
    noteQuestion: "Complete the map instruction with ONE WORD: The support number is printed in _____ on the map.", noteAnswers: ["red"], noteExplanation: "The support number is printed in red.",
    shortQuestion: "Write NO MORE THAN TWO WORDS: What is the final stop?", shortAnswers: ["bird tower", "the bird tower"], shortExplanation: "The final stop is the bird tower."
  },
  {
    slug: "language-course",
    topic: "Evening language course enrolment",
    transcript: `ADMINISTRATOR: Westfield Languages. Which course are you interested in?
CALLER: Intermediate Spanish, preferably in the evening.
ADMINISTRATOR: We have two groups. Monday uses the main textbook and focuses on travel. Wednesday uses news articles and has more discussion. Both run from 6:30 to 8:00 for ten weeks.
CALLER: Wednesday sounds better. Where is it held?
ADMINISTRATOR: In Building C, Room 14. Enter through the glass doors beside the pharmacy; the main college gate is locked after six.
CALLER: How much is the course?
ADMINISTRATOR: The fee is 195 pounds, including online exercises. The printed workbook is optional and costs 18 pounds.
CALLER: Is there an exam?
ADMINISTRATOR: There is no final exam. In week one, the tutor gives a short placement interview. In week ten, each student gives a five-minute presentation and receives feedback.
CALLER: I might miss the third week.
ADMINISTRATOR: Lessons are not recorded, but slides are uploaded the following morning. You can also attend the Monday group that week if you email the tutor in advance.`,
    formQuestion: "Complete the course note with ONE WORD: The Wednesday class uses news _____.", formAnswers: ["articles"], formExplanation: "The Wednesday class uses news articles.",
    detailQuestion: "How long does the course last?", detailAnswer: "ten weeks", detailDistractors: ["five weeks", "eight weeks", "fourteen weeks"],
    matchQuestion: "What happens in week ten?", matchAnswer: "a five-minute presentation", matchDistractors: ["a written final exam", "a placement interview", "a travel excursion"],
    locationQuestion: "Which entrance should evening students use?", locationAnswer: "The glass doors beside the pharmacy", locationDistractors: ["The locked main college gate", "The door behind Room 14", "The entrance to the Monday classroom"],
    noteQuestion: "Complete the fee note with ONE WORD: Online _____ are included in the course fee.", noteAnswers: ["exercises"], noteExplanation: "The fee includes online exercises.",
    shortQuestion: "Write NO MORE THAN TWO WORDS: When are missed-lesson slides uploaded?", shortAnswers: ["following morning", "next morning"], shortExplanation: "Slides are uploaded the following morning."
  },
  {
    slug: "marine-lecture",
    topic: "Lecture on coastal seagrass",
    transcript: `LECTURER: Seagrass is a flowering plant, not a seaweed. It forms underwater meadows in shallow coastal water where enough light reaches the seabed. Today I will focus on how those meadows modify their environment.

First, the leaves slow water movement. Suspended particles settle, which can make the water clearer. The roots and underground stems then hold sediment in place. This reduces erosion, although a meadow exposed to repeated anchor damage may develop bare channels where currents accelerate.

Second, seagrass provides habitat. Juvenile fish use the leaves as shelter, and small animals graze on algae growing on the leaf surface. Do not write that every fish species depends on seagrass; the evidence is strongest for particular life stages and locations.

Finally, seagrass stores carbon in both living tissue and sediment. Measuring this store is difficult because sediment depth varies. Our research team takes cores at twenty random points rather than sampling only the thickest part of a meadow. Next week, Dr Imani will explain how the cores are dated. Before then, read the methods paper on the course site and submit one question by noon on Tuesday.`,
    formQuestion: "Complete the lecture note with ONE WORD: Seagrass needs sufficient _____ at the seabed.", formAnswers: ["light"], formExplanation: "Seagrass grows where enough light reaches the seabed.",
    detailQuestion: "How can seagrass leaves improve water clarity?", detailAnswer: "They slow water so suspended particles settle.", detailDistractors: ["They increase erosion around anchors.", "They remove every form of algae.", "They deepen the coastal water."],
    matchQuestion: "Which part of seagrass holds sediment in place?", matchAnswer: "roots and underground stems", matchDistractors: ["flowers and floating seeds", "algae on the leaves", "juvenile fish"],
    locationQuestion: "Where does the research team take sediment cores?", locationAnswer: "At twenty random points across the meadow", locationDistractors: ["Only in the thickest section", "Only in bare anchor channels", "At one point beside the shore"],
    noteQuestion: "Complete the warning with ONE WORD: Repeated anchor damage can create bare _____.", noteAnswers: ["channels"], noteExplanation: "Anchor damage may produce bare channels.",
    shortQuestion: "Write NO MORE THAN TWO WORDS: Who will explain core dating next week?", shortAnswers: ["Imani", "Dr Imani"], shortExplanation: "Dr Imani will explain how the cores are dated."
  }
];

const task1Sets = [
  ["household recycling rates in four districts in 2015 and 2025", "District | 2015 | 2025\nNorth | 42% | 61%\nEast | 55% | 58%\nSouth | 31% | 54%\nWest | 48% | 45%"],
  ["average weekday passenger numbers on three bus routes before and after a timetable change", "Route | Before | After\nA | 18,400 | 21,600\nB | 12,900 | 12,100\nC | 9,700 | 14,300"],
  ["the sources of electricity in a region in 2000 and 2025", "Source | 2000 | 2025\nCoal | 52% | 18%\nGas | 28% | 24%\nWind | 4% | 31%\nSolar | 1% | 19%\nOther | 15% | 8%"],
  ["monthly water use by three sectors during a dry year", "Month | Homes | Agriculture | Industry (million litres)\nJanuary | 82 | 120 | 64\nApril | 78 | 155 | 62\nJuly | 96 | 230 | 66\nOctober | 80 | 142 | 61"],
  ["the number of visitors to four museum galleries before and after renovation", "Gallery | Before | After (thousands)\nNatural History | 210 | 286\nLocal History | 146 | 173\nDesign | 118 | 205\nTextiles | 92 | 89"],
  ["how graduates in two years entered employment, further study or other activities", "Destination | 2012 | 2024\nFull-time work | 54% | 46%\nPart-time work | 12% | 18%\nFurther study | 21% | 27%\nOther | 13% | 9%"],
  ["average daily screen time by age group on weekdays and weekends", "Age | Weekday | Weekend\n13-17 | 4.1 h | 5.8 h\n18-29 | 5.0 h | 5.6 h\n30-49 | 3.7 h | 4.2 h\n50+ | 2.6 h | 3.3 h"],
  ["the proportion of commuters using four transport modes in two cities", "Mode | Harbridge | Westport\nCar | 44% | 31%\nPublic transport | 29% | 42%\nCycling | 16% | 9%\nWalking | 11% | 18%"],
  ["changes in the floor area of a public library after redevelopment", "Use | Before | After (m²)\nBook shelves | 1,200 | 850\nStudy space | 420 | 780\nChildren's area | 180 | 360\nCafé | 0 | 190\nOffices | 300 | 220"],
  ["the stages used to turn discarded glass bottles into new containers", "Process: collection -> colour sorting -> crushing -> contaminant removal -> furnace melting -> moulding -> quality inspection -> distribution"],
  ["average crop yield under three irrigation systems over four seasons", "System | Spring | Summer | Autumn | Winter (tonnes/ha)\nFlood | 4.2 | 3.8 | 4.0 | 2.9\nSprinkler | 4.5 | 4.7 | 4.3 | 3.2\nDrip | 4.8 | 5.4 | 4.9 | 3.6"],
  ["weekly exercise time among adults in five employment groups", "Group | 2010 | 2025 (minutes)\nOffice | 95 | 138\nManual | 72 | 91\nHealthcare | 84 | 102\nEducation | 110 | 126\nSelf-employed | 76 | 119"],
  ["international and domestic enrolments at a university from 2018 to 2024", "Year | Domestic | International\n2018 | 14,200 | 3,100\n2020 | 14,850 | 3,650\n2022 | 15,100 | 3,420\n2024 | 15,600 | 4,280"],
  ["household spending in six categories in two countries", "Category | Country A | Country B\nHousing | 34% | 27%\nFood | 18% | 24%\nTransport | 16% | 14%\nHealth | 8% | 12%\nLeisure | 14% | 13%\nOther | 10% | 10%"],
  ["the movement of food waste through a municipal composting system", "Process: household caddies -> weekly collection -> inspection -> shredding -> 3 weeks in enclosed vessels -> 8 weeks outdoor maturation -> screening -> use in parks and farms"],
  ["average apartment rents in four zones over a ten-year period", "Zone | 2015 | 2020 | 2025 (currency units)\nCentre | 980 | 1,240 | 1,510\nInner suburbs | 760 | 920 | 1,170\nOuter suburbs | 610 | 720 | 850\nRural fringe | 520 | 600 | 690"],
  ["the percentages of five packaging materials recovered for recycling", "Material | 2010 | 2025\nPaper | 68% | 79%\nGlass | 61% | 74%\nSteel | 55% | 82%\nAluminium | 42% | 67%\nPlastic | 18% | 29%"],
  ["the time spent on four stages of producing a custom bicycle before and after automation", "Stage | Before | After (hours)\nDesign | 6.0 | 4.5\nFrame cutting | 8.0 | 3.0\nAssembly | 10.0 | 8.5\nTesting | 3.0 | 4.0"],
  ["the population distribution of a town by age in 2005 and 2025", "Age | 2005 | 2025\n0-14 | 21% | 16%\n15-29 | 24% | 20%\n30-49 | 31% | 29%\n50-64 | 15% | 20%\n65+ | 9% | 15%"],
  ["annual energy consumption in three building types before and after insulation upgrades", "Building | Before | After (MWh)\nPrimary school | 420 | 298\nSports centre | 680 | 515\nTown hall | 510 | 332"]
];

const task2Prompts = [
  "Some cities are considering charging private vehicles to enter crowded central areas. To what extent do the benefits of this policy outweigh the disadvantages?",
  "University students should be required to take at least one course outside their main field of study. Do you agree or disagree?",
  "Many employers now allow staff to work from home for part of the week. Discuss the advantages and disadvantages for employees and organisations.",
  "Public money should prioritise maintaining existing cultural institutions rather than creating new ones. Discuss both views and give your own opinion.",
  "Some people believe that product packaging should display its environmental cost as clearly as its price. To what extent do you agree or disagree?",
  "In some countries, younger adults are moving away from small towns while older residents remain. What problems can this cause, and what measures could address them?",
  "Schools increasingly use automated systems to give students feedback on routine assignments. Is this a positive or negative development?",
  "Governments should make public transport free in order to reduce traffic congestion. To what extent would this policy be effective?",
  "Some people think scientific research funded by the public should be freely available to everyone. Others believe access may need restrictions. Discuss both views and give your opinion.",
  "The repair of consumer products is often more expensive than replacement. Why is this the case, and what could be done to encourage repair?",
  "Museums should focus on objects from their own region rather than collecting material from around the world. Discuss both views and give your opinion.",
  "It is becoming common for people to track sleep, exercise and other daily activities using digital devices. Do the advantages of this trend outweigh the disadvantages?",
  "Some companies have introduced a four-day working week without reducing salaries. What effects might this have on productivity and society?",
  "Urban land should be used for housing rather than for parks and community gardens. To what extent do you agree or disagree?",
  "People are exposed to more numerical information than in the past, but this does not necessarily improve public decisions. Why might this be so, and how can data literacy be improved?",
  "Some educators argue that students learn more from producing work together than from individual assignments. Discuss both views and give your own opinion.",
  "Governments should protect communities from the effects of extreme weather, while individuals should take responsibility for their own preparation. Discuss both views and give your opinion.",
  "Advertising that uses personal online data should be prohibited. To what extent do you agree or disagree?",
  "As translation technology improves, learning foreign languages will become unnecessary. Do you agree or disagree?",
  "Some people prefer experts to make important public-policy decisions, while others want wider citizen participation. Discuss both views and give your own opinion."
];

const languageChoices = [
  ["The survey was repeated twice to ensure that the findings were _____.", "reliable", ["reliant", "relieved", "relative"], "Reliable means consistent enough to be trusted; the other forms do not fit the intended meaning."],
  ["The new policy reduced energy use; _____, it did not lower the building's peak demand.", "however", ["therefore", "for example", "similarly"], "However marks the contrast between lower total use and unchanged peak demand."],
  ["Which sentence reports a cautious academic conclusion?", "The intervention may have contributed to the observed decline.", ["The intervention definitely caused every part of the decline.", "The decline proves the intervention can never fail.", "There is no possible explanation except the intervention."], "May have contributed appropriately limits the causal claim."],
  ["The researchers controlled _____ age and prior experience in the final analysis.", "for", ["at", "from", "into"], "The established academic collocation is control for a variable."],
  ["Choose the most concise sentence.", "Demand fell by 12% after the fee was introduced.", ["There was a fall that occurred in demand by a total amount of 12% after the fee was introduced.", "After the fee was introduced, it was demand that experienced a fall which was 12%.", "Demand, which is what fell, did so by 12% after the introduction of the fee that was introduced."], "The correct sentence expresses the complete comparison without redundant wording."],
  ["The two samples were similar _____ size but differed substantially in age.", "in", ["on", "with", "by"], "Similar in size is the correct prepositional pattern."],
  ["Which option best avoids overgeneralisation?", "Several participants reported difficulty using the interface.", ["Users cannot operate the interface.", "The interface is impossible for everyone.", "All digital interfaces cause difficulty."], "Several participants accurately preserves the limited scope of the evidence."],
  ["By the time the second survey began, the research team _____ the questionnaire.", "had revised", ["revises", "has revising", "was revise"], "Past perfect marks an action completed before another past event."],
  ["The increase was small in absolute terms, _____ it was statistically significant.", "although", ["because", "unless", "so that"], "Although introduces the contrast between small magnitude and statistical significance."],
  ["Which sentence uses evidence rather than opinion as its grammatical subject?", "The attendance records indicate a gradual recovery.", ["I strongly feel that attendance recovered.", "Everyone knows attendance recovered.", "Obviously, attendance must have recovered."], "The attendance records identify the evidence that supports the claim."],
  ["Neither the cost estimates nor the final schedule _____ available at the meeting.", "was", ["were being", "have", "be"], "With neither...nor, agreement commonly follows the nearer singular subject, final schedule."],
  ["The report distinguishes temporary fluctuations _____ long-term trends.", "from", ["against", "beside", "within"], "Distinguish X from Y is the standard construction."],
  ["Which noun best completes the phrase 'a _____ decline in rainfall'?", "marked", ["marking", "markedly", "marker"], "Marked is an adjective meaning clear or noticeable and modifies decline."],
  ["If the sensor had been calibrated correctly, the error _____ earlier.", "would have been detected", ["will detect", "would detect", "has been detecting"], "The third conditional requires would have plus the past participle for an unreal past result."],
  ["The study provides insight _____ how commuters respond to flexible fares.", "into", ["over", "across", "beside"], "Insight into is the conventional academic collocation."],
  ["Which sentence correctly describes an unchanged figure?", "The proportion remained stable at approximately 35%.", ["The proportion stabilised down by 35%.", "The proportion was remained at 35%.", "The proportion remained stability of 35%."], "Remain stable at correctly describes a level that did not change."],
  ["The model is useful, provided that its assumptions _____ clearly stated.", "are", ["is", "being", "has"], "The plural subject assumptions takes are in the passive construction."],
  ["Which phrase most appropriately introduces a limitation?", "A key constraint of the analysis is...", ["This perfect analysis proves...", "Nobody could disagree that...", "The result is obviously true because..."], "The phrase directly signals a limitation in formal academic language."],
  ["There was _____ evidence to determine whether the change would persist.", "insufficient", ["inefficient", "unfinished", "insecure"], "Insufficient evidence means not enough evidence for a conclusion."],
  ["The final category accounted _____ just under one fifth of total expenditure.", "for", ["to", "with", "as"], "Accounted for is the correct phrase for expressing a proportion."]
];

const languageFills = [
  ["Complete with ONE WORD: The results are consistent _____ the hypothesis proposed in the introduction.", ["with"], "The standard collocation is consistent with."],
  ["Complete with ONE WORD: A sharp rise was followed _____ a period of relative stability.", ["by"], "Followed by identifies what came next."],
  ["Complete with ONE WORD: The sample was too small to draw a firm _____.", ["conclusion"], "Draw a conclusion is the relevant academic collocation."],
  ["Complete with ONE WORD: The two groups differed significantly _____ their response time.", ["in"], "Groups differ in a measured characteristic."],
  ["Complete with ONE WORD: The figure for rail travel was twice _____ high as the figure for cycling.", ["as"], "The comparative structure is twice as high as."],
  ["Complete with ONE WORD: The authors attribute the improvement _____ better staff training.", ["to"], "Attribute an outcome to a cause is the correct construction."],
  ["Complete with ONE WORD: Sales peaked _____ 8,400 units in July.", ["at"], "Peak at introduces the highest numerical value."],
  ["Complete with ONE WORD: The study raises concerns _____ the long-term cost of maintenance.", ["about"], "Raise concerns about is the established phrase."],
  ["Complete with ONE WORD: No data were collected during winter; _____, seasonal effects cannot be excluded.", ["therefore", "consequently", "thus"], "A result connector is required because the missing data lead to the stated limitation."],
  ["Complete with ONE WORD: The percentage declined gradually, _____ 62% to 49%.", ["from"], "From introduces the starting value in a from-to comparison."],
  ["Complete with ONE WORD: The equipment must be calibrated _____ measurements are taken.", ["before"], "Calibration needs to occur prior to measurement."],
  ["Complete with ONE WORD: The policy had little effect _____ households that already used less water.", ["on"], "Have an effect on is the correct collocation."],
  ["Complete with ONE WORD: Participants were asked _____ they had used the service previously.", ["whether", "if"], "Whether or if introduces an indirect yes-or-no question."],
  ["Complete with ONE WORD: The north recorded the highest value, _____ the west had the lowest.", ["whereas", "while"], "Whereas or while marks a direct contrast between the regions."],
  ["Complete with ONE WORD: The estimate should be treated with _____ because several records were incomplete.", ["caution"], "Treat with caution is the appropriate academic phrase."],
  ["Complete with ONE WORD: There is no evidence _____ the two events are causally related.", ["that"], "That introduces the content of the evidence claim."],
  ["Complete with ONE WORD: The revised process is more efficient _____ the original method.", ["than"], "A comparative adjective takes than."],
  ["Complete with ONE WORD: The chart illustrates how the material is separated _____ being recycled.", ["before"], "The material is separated prior to recycling."],
  ["Complete with ONE WORD: Only a small _____ of respondents selected the final option.", ["minority", "proportion", "percentage"], "Each accepted noun forms a grammatical quantity phrase and preserves the meaning."],
  ["Complete with ONE WORD: Further research is required to establish _____ the pattern applies elsewhere.", ["whether"], "Whether introduces the unresolved alternative." ]
];

function rotateOptions(correct, distractors, seed) {
  const options = [correct, ...distractors];
  const shift = seed % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return { options: rotated, answer: rotated.indexOf(correct) };
}

function metadata(sourceUrl) {
  return { source: SOURCE, sourceUrl, license: LICENSE, referenceOnly: true, officialQuestionTextCopied: false };
}

function choice({ id, topic, taskType, question, correct, distractors, explanation, passage, sourceUrl, seed }) {
  const keyed = rotateOptions(correct, distractors, seed);
  return { id, type: "choice", subject: "ielts", topic, difficulty: "Advanced", taskType, question, ...keyed, explanation, ...(passage ? { passage } : {}), ...metadata(sourceUrl) };
}

function fill({ id, topic, taskType, question, answers, explanation, passage, sourceUrl }) {
  return { id, type: "fill", subject: "ielts", topic, difficulty: "Advanced", taskType, question, answers, explanation, ...(passage ? { passage } : {}), ...metadata(sourceUrl) };
}

function open({ id, topic, taskType, question, checkpoints, wordTarget, passage, explanation }) {
  return { id, type: "open", subject: "ielts", topic, difficulty: "Advanced", taskType, question, checkpoints, wordTarget, ...(passage ? { passage } : {}), explanation, ...metadata(WRITING_URL) };
}

function buildReadingQuestions(set, index) {
  const prefix = `ielts-reading-${set.slug}`;
  const context = `Read the passage about ${set.topic}.`;
  return [
    choice({ id: `${prefix}-heading`, topic: `Academic Reading · ${set.topic}`, taskType: "Matching Headings", question: `${context} Which heading best matches the passage?`, correct: set.heading, distractors: set.headingDistractors, explanation: `The passage develops the idea expressed by "${set.heading}" across its paragraphs; each alternative contradicts or narrows the text.`, passage: set.passage, sourceUrl: READING_URL, seed: index }),
    choice({ id: `${prefix}-main`, topic: `Academic Reading · ${set.topic}`, taskType: "Multiple Choice · Main Idea", question: `${context} Which statement best expresses the main idea?`, correct: set.mainIdea, distractors: set.mainDistractors, explanation: `This option captures the overall argument and its qualification. The alternatives make absolute or unsupported claims.`, passage: set.passage, sourceUrl: READING_URL, seed: index + 1 }),
    choice({ id: `${prefix}-detail`, topic: `Academic Reading · ${set.topic}`, taskType: "Multiple Choice · Detail", question: `${context} ${set.detailQuestion}`, correct: set.detailAnswer, distractors: set.detailDistractors, explanation: `The passage directly supports: ${set.detailAnswer}`, passage: set.passage, sourceUrl: READING_URL, seed: index + 2 }),
    choice({ id: `${prefix}-inference`, topic: `Academic Reading · ${set.topic}`, taskType: "Multiple Choice · Inference", question: `${context} Which conclusion is best supported by the passage?`, correct: set.inference, distractors: set.inferenceDistractors, explanation: `The supported inference is: ${set.inference} The other choices add claims not established by the text.`, passage: set.passage, sourceUrl: READING_URL, seed: index + 3 }),
    choice({ id: `${prefix}-vocabulary`, topic: `Academic Reading · ${set.topic}`, taskType: "Vocabulary in Context", question: `${context} In this passage, the word "${set.vocabWord}" is closest in meaning to:`, correct: set.vocabAnswer, distractors: set.vocabDistractors, explanation: `In its sentence, "${set.vocabWord}" means "${set.vocabAnswer}."`, passage: set.passage, sourceUrl: READING_URL, seed: index }),
    choice({ id: `${prefix}-tfng`, topic: `Academic Reading · ${set.topic}`, taskType: "TRUE / FALSE / NOT GIVEN", question: `${context} Decide whether this statement agrees with the passage: "${set.tfngStatement}"`, correct: set.tfngAnswer, distractors: ["TRUE", "FALSE", "NOT GIVEN"].filter(value => value !== set.tfngAnswer), explanation: set.tfngExplanation, passage: set.passage, sourceUrl: READING_URL, seed: index + 1 }),
    fill({ id: `${prefix}-summary`, topic: `Academic Reading · ${set.topic}`, taskType: "Summary Completion", question: set.summaryQuestion, answers: set.summaryAnswers, explanation: set.summaryExplanation, passage: set.passage, sourceUrl: READING_URL }),
    fill({ id: `${prefix}-short-answer`, topic: `Academic Reading · ${set.topic}`, taskType: "Short-answer Question", question: set.shortQuestion, answers: set.shortAnswers, explanation: set.shortExplanation, passage: set.passage, sourceUrl: READING_URL })
  ];
}

function buildListeningQuestions(set, index) {
  const prefix = `ielts-listening-${set.slug}`;
  const topic = `Listening Transcript · ${set.topic}`;
  return [
    fill({ id: `${prefix}-form`, topic, taskType: "Form Completion", question: set.formQuestion, answers: set.formAnswers, explanation: set.formExplanation, passage: set.transcript, sourceUrl: LISTENING_URL }),
    choice({ id: `${prefix}-detail`, topic, taskType: "Multiple Choice", question: `Read the transcript for ${set.topic}. ${set.detailQuestion}`, correct: set.detailAnswer, distractors: set.detailDistractors, explanation: `The speaker gives the answer as ${set.detailAnswer}.`, passage: set.transcript, sourceUrl: LISTENING_URL, seed: index }),
    choice({ id: `${prefix}-matching`, topic, taskType: "Matching", question: `Read the transcript for ${set.topic}. ${set.matchQuestion}`, correct: set.matchAnswer, distractors: set.matchDistractors, explanation: `The relevant speaker matches this item with ${set.matchAnswer}.`, passage: set.transcript, sourceUrl: LISTENING_URL, seed: index + 1 }),
    choice({ id: `${prefix}-location`, topic, taskType: "Plan / Map / Location Labelling", question: `Read the transcript for ${set.topic}. ${set.locationQuestion}`, correct: set.locationAnswer, distractors: set.locationDistractors, explanation: `The location description in the transcript is ${set.locationAnswer}.`, passage: set.transcript, sourceUrl: LISTENING_URL, seed: index + 2 }),
    fill({ id: `${prefix}-note`, topic, taskType: "Note Completion", question: set.noteQuestion, answers: set.noteAnswers, explanation: set.noteExplanation, passage: set.transcript, sourceUrl: LISTENING_URL }),
    fill({ id: `${prefix}-short-answer`, topic, taskType: "Short-answer Question", question: set.shortQuestion, answers: set.shortAnswers, explanation: set.shortExplanation, passage: set.transcript, sourceUrl: LISTENING_URL })
  ];
}

// Keep the first release at 20 complete passages; later curated sets remain available
// in this generator for a future versioned expansion.
const readingQuestions = readingSets.slice(0, 20).flatMap(buildReadingQuestions);
const listeningQuestions = listeningSets.flatMap(buildListeningQuestions);
const writingQuestions = [
  ...task1Sets.map(([description, data], index) => open({
    id: `ielts-writing-task1-${String(index + 1).padStart(2, "0")}`,
    topic: `Academic Writing · Task 1 · ${description}`,
    taskType: "Academic Writing Task 1",
    question: `The information below shows ${description}. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
    passage: data,
    wordTarget: 170,
    checkpoints: ["Present a clear overview of the most important patterns.", "Select and compare key figures or stages instead of listing every detail.", "Report the information accurately without inventing causes or opinions.", "Use coherent paragraphing and varied comparison language."],
    explanation: "A strong response identifies the dominant patterns first, then supports the overview with selective and accurate comparisons."
  })),
  ...task2Prompts.map((prompt, index) => open({
    id: `ielts-writing-task2-${String(index + 1).padStart(2, "0")}`,
    topic: `Academic Writing · Task 2 · ${["Transport", "Education", "Work", "Culture", "Environment", "Communities", "Technology", "Public services", "Research", "Consumption"][index % 10]}`,
    taskType: "Academic Writing Task 2",
    question: `${prompt} Write at least 250 words.`,
    wordTarget: 280,
    checkpoints: ["Answer every part of the task and maintain a clear position.", "Develop each main idea with explanation and a relevant example.", "Organise paragraphs so that the argument progresses logically.", "Use precise academic vocabulary and a controlled range of sentence structures."],
    explanation: "A strong response addresses the exact task, develops a consistent position and supports each main claim rather than relying on memorised general statements."
  }))
];

const languageQuestions = [
  ...languageChoices.map(([question, correct, distractors, explanation], index) => choice({ id: `ielts-language-choice-${String(index + 1).padStart(2, "0")}`, topic: "Academic Language Accuracy", taskType: "Language Accuracy · Multiple Choice", question, correct, distractors, explanation, sourceUrl: OVERVIEW_URL, seed: index })),
  ...languageFills.map(([question, answers, explanation], index) => fill({ id: `ielts-language-fill-${String(index + 1).padStart(2, "0")}`, topic: "Academic Language Accuracy", taskType: "Language Accuracy · Completion", question, answers, explanation, sourceUrl: OVERVIEW_URL }))
];

const questions = [...readingQuestions, ...listeningQuestions, ...writingQuestions, ...languageQuestions];

function stringsIn(value, key = "") {
  if (typeof value === "string") return [key, value];
  if (Array.isArray(value)) return value.flatMap(item => stringsIn(item, key));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([childKey, child]) => stringsIn(child, childKey));
  return [];
}

function validate() {
  const errors = [];
  const ids = new Set();
  const prompts = new Set();
  const counts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, questions.filter(question => question.type === type).length]));
  if (questions.length !== 300) errors.push(`Expected 300 questions, found ${questions.length}`);
  if (readingQuestions.length !== 160 || listeningQuestions.length !== 60 || writingQuestions.length !== 40 || languageQuestions.length !== 40) errors.push("Section counts do not equal 160/60/40/40");
  if (counts.choice !== 170 || counts.fill !== 90 || counts.open !== 40) errors.push(`Unexpected type counts: ${JSON.stringify(counts)}`);
  for (const question of questions) {
    if (ids.has(question.id)) errors.push(`Duplicate id: ${question.id}`);
    ids.add(question.id);
    if (prompts.has(question.question)) errors.push(`Duplicate prompt: ${question.question}`);
    prompts.add(question.question);
    if (question.subject !== "ielts" || !question.topic || !question.taskType || !question.explanation) errors.push(`Incomplete question: ${question.id}`);
    if (question.source !== SOURCE || question.license !== LICENSE || question.referenceOnly !== true || question.officialQuestionTextCopied !== false || !question.sourceUrl?.startsWith("https://ielts.org/")) errors.push(`Invalid source metadata: ${question.id}`);
    if (question.type === "choice") {
      if (!Array.isArray(question.options) || question.options.length < 3 || new Set(question.options).size !== question.options.length || !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) errors.push(`Malformed choice: ${question.id}`);
    } else if (question.type === "fill") {
      if (!Array.isArray(question.answers) || !question.answers.length || question.answers.some(answer => !String(answer).trim())) errors.push(`Malformed fill: ${question.id}`);
    } else if (question.type === "open") {
      if (!Array.isArray(question.checkpoints) || question.checkpoints.length < 3) errors.push(`Malformed open task: ${question.id}`);
    } else {
      errors.push(`Unknown type: ${question.id}`);
    }
    for (const [key, value] of stringsIn(question)) {
      if (["question", "passage", "options", "answers", "explanation", "topic", "taskType", "checkpoints"].includes(key) && /[\u3400-\u9fff]/u.test(value)) errors.push(`Non-English text in ${question.id}.${key}`);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

validate();

const bank = {
  schemaVersion: 1,
  bank: {
    id: "ielts-original-2026",
    title: "Original IELTS-style Academic Practice Bank",
    version: "1.0.0",
    description: "300 project-original English questions covering Academic Reading, transcript-based Listening practice, Academic Writing and language accuracy. Official IELTS pages are used only to reference task formats; no official question text is copied.",
    generator: "scripts/generate-ielts-bank.mjs",
    source: SOURCE,
    sourceUrl: OVERVIEW_URL,
    license: LICENSE,
    referenceOnly: true,
    officialQuestionTextCopied: false
  },
  questions
};

await writeFile(output, `${JSON.stringify(bank, null, 2)}\n`, "utf8");
console.log(`Generated ${questions.length} original IELTS-style questions (${readingQuestions.length} Reading, ${listeningQuestions.length} Listening, ${writingQuestions.length} Writing, ${languageQuestions.length} Language).`);
