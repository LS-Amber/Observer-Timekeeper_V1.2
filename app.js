// ============================================================
// 高维文明观测员 v1.2 — 观测周期 + 成就 + 插图升级版
// ============================================================
const STORAGE_KEY = "dimension-observer-v1.2";

// ── 行星类型 ──
const PLANET_TYPES = {
  rock:     { name: "岩石行星",   icon: "🪨", desc: "最接近类地世界，演化均衡，推荐新手。" },
  ocean:    { name: "海洋行星",   icon: "🌊", desc: "海洋覆盖率极高，生命诞生较早，文明登陆较慢。" },
  desert:   { name: "沙漠行星",   icon: "🏜️", desc: "水资源稀缺、昼夜温差大，生命窗口较窄但顽强。" },
  ice:      { name: "冰封行星",   icon: "🧊", desc: "全球低温冰盖广布，需靠火山或温室效应开启生命窗口。" },
  volcanic: { name: "火山行星",   icon: "🌋", desc: "地质活动极强，前期危险但有利于化学循环。" },
  swamp:    { name: "沼泽温室行星", icon: "☁️", desc: "大气厚重湿热，容易形成复杂化学环境。" },
  moon:     { name: "巨行星卫星", icon: "🌑", desc: "潮汐作用强，辐射变化大，科幻感强。" }
};

// ── 恒星系 ──
const STAR_SYSTEMS = {
  red_dwarf:  { name: "红矮星系",   icon: "🔴", desc: "寿命长能量温和，但耀斑频繁。" },
  sun_like:   { name: "类太阳单星", icon: "☀️", desc: "最均衡稳定，适合新手。" },
  binary:     { name: "双星系统",   icon: "⚛️", desc: "季节与辐照变化复杂，演化戏剧化。" },
  blue_white: { name: "蓝白年轻星", icon: "💠", desc: "能量充沛环境激烈，高风险高波动。" },
  old_orange: { name: "老年橙红星", icon: "🟠", desc: "光照柔和偏老，适合沉浸叙事。" }
};

// ── 生命倾向 ──
const LIFE_BIASES = {
  carbon:      { name: "碳基倾向",   icon: "🧬", desc: "默认路线，事件文本最丰富。" },
  silicon:     { name: "硅基倾向",   icon: "💎", desc: "高温、火山、矿物事件加权更高。" },
  oceanic:     { name: "海洋倾向",   icon: "🐚", desc: "生命多从深海开始，登陆更晚。" },
  extremophile:{ name: "极端嗜性",   icon: "☢️", desc: "更容易在极端环境下诞生早期生命。" }
};

// ── 31 阶段 ──
const STAGES = [
  { id:1,  key:"nebula_accretion",    name:"星云凝聚",     cat:"planet",  icon:"🌫️", desc:"尘埃盘汇聚，原行星逐步成形。", minHours:0,    baseChance:0.20 },
  { id:2,  key:"molten_barren",       name:"熔融蛮荒",     cat:"planet",  icon:"🔥", desc:"地表熔融，陨石频发，环境极端。", minHours:0.5,  baseChance:0.18 },
  { id:3,  key:"crust_forming",       name:"地壳初稳",     cat:"planet",  icon:"🪨", desc:"岩层冷却，火山与板块活动活跃。", minHours:1,    baseChance:0.16 },
  { id:4,  key:"primitive_atmosphere", name:"原始大气",     cat:"planet",  icon:"💨", desc:"大气开始稳定，云层与降雨形成。", minHours:2,    baseChance:0.15 },
  { id:5,  key:"ocean_ice_forming",   name:"海洋/冰层定型", cat:"planet", icon:"🌊", desc:"液态水、冰层、盐湖或地下海出现。", minHours:3,    baseChance:0.14 },
  { id:6,  key:"organic_enrichment",  name:"有机富集",     cat:"planet",  icon:"🧪", desc:"矿物循环、闪电、热泉推动复杂化学。", minHours:5,    baseChance:0.12 },
  { id:7,  key:"prebiotic_system",    name:"前生命体系",   cat:"life",    icon:"🔬", desc:"膜结构、复制前体、化学网络出现。", minHours:8,    baseChance:0.12 },
  { id:8,  key:"replication_origin",  name:"原始复制结构", cat:"life",    icon:"🧫", desc:"自复制分子链开始在特定环境中扩散。", minHours:12,   baseChance:0.10 },
  { id:9,  key:"first_life",          name:"第一生命",     cat:"life",    icon:"🦠", desc:"微型生命诞生！", minHours:16,   baseChance:0.14 },
  { id:10, key:"microbe_spread",      name:"微生物扩散",   cat:"life",    icon:"🔵", desc:"海洋或地下生态扩展，局部生态建立。", minHours:22,   baseChance:0.13 },
  { id:11, key:"metabolic_revolution",name:"光合/代谢革命", cat:"life",   icon:"🌿", desc:"大气成分改变，能量利用方式变多。", minHours:30,   baseChance:0.12 },
  { id:12, key:"complex_cells",       name:"复杂细胞",     cat:"life",    icon:"🔮", desc:"真核化、协同结构、细胞复杂化。", minHours:40,   baseChance:0.11 },
  { id:13, key:"multicellular",       name:"多细胞生态",   cat:"life",    icon:"🪸", desc:"捕食、共生、群落竞争开始出现。", minHours:55,   baseChance:0.10 },
  { id:14, key:"higher_species",      name:"高等物种演化", cat:"life",    icon:"🐾", desc:"感官、骨骼、登陆、社会行为逐步发展。", minHours:75,   baseChance:0.10 },
  { id:15, key:"intelligent_dawn",    name:"智慧生命曙光", cat:"life",    icon:"👁️", desc:"工具、语言、符号、文化雏形出现。", minHours:100,  baseChance:0.09 },
  { id:16, key:"primitive_groups",    name:"原始群体时代", cat:"civ",     icon:"👣", desc:"稳定小群体，初级合作与领地意识。", minHours:120,  baseChance:0.12 },
  { id:17, key:"tool_emergence",      name:"工具萌发时代", cat:"civ",     icon:"🪓", desc:"石片、骨器、火种等工具行为出现。", minHours:140,  baseChance:0.12 },
  { id:18, key:"tribal_totem",        name:"部落与图腾时代",cat:"civ",    icon:"🎭", desc:"仪式、图腾、口述传承形成。", minHours:160,  baseChance:0.11 },
  { id:19, key:"settlement",          name:"定居聚落时代", cat:"civ",     icon:"🏘️", desc:"固定栖居地，防御、储藏、分工形成。", minHours:180,  baseChance:0.11 },
  { id:20, key:"agriculture",         name:"农耕/驯化时代",cat:"civ",     icon:"🌾", desc:"植物种植、动物驯化、周期性生产稳定化。", minHours:200,  baseChance:0.10 },
  { id:21, key:"city_writing",        name:"城邦与文字时代",cat:"civ",    icon:"📜", desc:"记账、法令、交易依赖记录，城邦制度出现。", minHours:230,  baseChance:0.10 },
  { id:22, key:"kingdom_alliance",    name:"王国/联盟时代",cat:"civ",     icon:"👑", desc:"税制、军队、道路、法统扩张。", minHours:260,  baseChance:0.09 },
  { id:23, key:"philosophy_sailing",  name:"哲思与航海时代",cat:"civ",    icon:"⛵", desc:"思辨、天文、长距离航行发展。", minHours:290,  baseChance:0.09 },
  { id:24, key:"craft_revolution",    name:"工艺革命时代", cat:"civ",     icon:"⚙️", desc:"精密工艺、齿轮、水力、冶金成熟。", minHours:320,  baseChance:0.09 },
  { id:25, key:"industrial",          name:"工业革命时代", cat:"civ",     icon:"🏭", desc:"高密度能源与机器体系诞生。", minHours:360,  baseChance:0.08 },
  { id:26, key:"electric_comm",       name:"电气与通信时代",cat:"civ",    icon:"⚡", desc:"电网、远距离通信、广播形成。", minHours:400,  baseChance:0.08 },
  { id:27, key:"information",         name:"信息网络时代", cat:"civ",     icon:"🌐", desc:"数据、网络、计算成为核心基础设施。", minHours:450,  baseChance:0.08 },
  { id:28, key:"ai_collaboration",    name:"智能协同时代", cat:"civ",     icon:"🤖", desc:"自动化、智能代理、协同决策系统广泛部署。", minHours:500,  baseChance:0.07 },
  { id:29, key:"space_exploration",   name:"太空探索时代", cat:"civ",     icon:"🚀", desc:"文明开始系统性进入轨道与近邻天体。", minHours:560,  baseChance:0.07 },
  { id:30, key:"planetary_union",     name:"行星联合时代", cat:"civ",     icon:"🪐", desc:"全球范围达成较强合作机制。", minHours:620,  baseChance:0.06 },
  { id:31, key:"interstellar_dawn",   name:"星际萌芽时代", cat:"civ",     icon:"✨", desc:"文明跨入宇宙文明门槛。", minHours:700,  baseChance:0.05 }
];

// ── 参数初始化模板 ──
function getInitialParameters(planetType, starSystem, lifeBias) {
  const p = {
    atmospherePressure: 0.8 + Math.random()*0.6,
    averageTemperature: 15 + Math.random()*20,
    seaLevel: 30 + Math.random()*30,
    waterAvailability: 35 + Math.random()*25,
    oxygenLevel: 0,
    radiationLevel: 25 + Math.random()*15,
    tectonicActivity: 40 + Math.random()*20,
    atmosphericStability: 35 + Math.random()*20,
    nutrientIndex: 20 + Math.random()*15,
    biosignatureLevel: 0
  };
  const pm = {
    rock:{averageTemperature:-5,seaLevel:5,atmosphericStability:8},
    ocean:{seaLevel:30,waterAvailability:25,averageTemperature:-3},
    desert:{seaLevel:-25,waterAvailability:-20,averageTemperature:15,radiationLevel:10},
    ice:{averageTemperature:-40,seaLevel:-10,waterAvailability:-5},
    volcanic:{tectonicActivity:25,averageTemperature:30,radiationLevel:8,nutrientIndex:10},
    swamp:{atmospherePressure:1.2,averageTemperature:12,waterAvailability:15,nutrientIndex:8},
    moon:{tectonicActivity:10,radiationLevel:12,atmosphericStability:-8}
  };
  const sm = {
    red_dwarf:{radiationLevel:8,averageTemperature:-5,atmosphericStability:5},
    sun_like:{atmosphericStability:5},
    binary:{radiationLevel:5,atmosphericStability:-8},
    blue_white:{radiationLevel:15,averageTemperature:10,atmosphericStability:-5},
    old_orange:{radiationLevel:-8,averageTemperature:-8,atmosphericStability:8}
  };
  const pmod=pm[planetType]||{}, smod=sm[starSystem]||{};
  for(const k of Object.keys(p)){p[k]+=(pmod[k]||0)+(smod[k]||0);}
  if(lifeBias==='extremophile'){p.radiationLevel-=5;}
  if(lifeBias==='oceanic'){p.waterAvailability+=8;p.seaLevel+=5;}
  if(lifeBias==='silicon'){p.averageTemperature+=10;p.tectonicActivity+=5;}
  p.atmospherePressure=clamp(p.atmospherePressure,0.1,6);
  p.averageTemperature=clamp(p.averageTemperature,-120,180);
  p.seaLevel=clamp(p.seaLevel,0,100);
  p.waterAvailability=clamp(p.waterAvailability,0,100);
  p.oxygenLevel=clamp(p.oxygenLevel,0,40);
  p.radiationLevel=clamp(p.radiationLevel,0,100);
  p.tectonicActivity=clamp(p.tectonicActivity,0,100);
  p.atmosphericStability=clamp(p.atmosphericStability,0,100);
  p.nutrientIndex=clamp(p.nutrientIndex,0,100);
  p.biosignatureLevel=0;
  return p;
}

function getInitialCivilization(){
  return {populationScale:0,socialComplexity:0,knowledgeLevel:0,technologyLevel:0,culturalCohesion:0,politicalStability:0,resourcePressure:0,ecologicalBalance:0,explorationDrive:0,warTension:0,spiritualDepth:0,automationLevel:0,spaceCapability:0,civilizationSignal:0};
}
function initCivilizationParams(){
  return {populationScale:8,socialComplexity:6,knowledgeLevel:5,technologyLevel:3,culturalCohesion:12,politicalStability:10,resourcePressure:18,ecologicalBalance:72,explorationDrive:9,warTension:6,spiritualDepth:7,automationLevel:0,spaceCapability:0,civilizationSignal:2};
}

// ── 随机事件池 ──
const NATURAL_EVENTS = [
  {id:"geo_plate_merge",title:"板块拼合",tags:["geology"],stageMin:3,stageMax:14,weight:1,effect:{tectonicActivity:5,nutrientIndex:3,atmosphericStability:-2},text:"两块大陆板块开始缓慢拼合，地壳应力在交界处释放出大量矿物。"},
  {id:"geo_hotspring",title:"深海热泉群扩张",tags:["geology","prelife"],stageMin:3,stageMax:10,weight:1.2,effect:{nutrientIndex:12,tectonicActivity:6,averageTemperature:1},text:"深海裂谷处涌出大量富含矿物的热液，化学花园在黑暗中无声扩展。"},
  {id:"geo_supervolcano",title:"超级火山爆发",tags:["geology","disaster"],stageMin:2,stageMax:20,weight:0.6,effect:{tectonicActivity:15,averageTemperature:-8,atmosphericStability:-12,radiationLevel:3},text:"一座超级火山喷发，火山灰遮蔽了大气层，全球温度骤降。"},
  {id:"geo_magnetic",title:"磁场增强",tags:["geology"],stageMin:3,stageMax:15,weight:0.8,effect:{radiationLevel:-8,atmosphericStability:6},text:"行星内核对流加强，磁场显著增强，大气层获得了更好的辐射屏障。"},
  {id:"geo_core_cool",title:"地核活动减弱",tags:["geology"],stageMin:5,stageMax:15,weight:0.5,effect:{tectonicActivity:-10,atmosphericStability:4},text:"地核逐渐冷却，板块运动放缓，地表趋于平静。"},
  {id:"clim_global_rain",title:"全球降雨期",tags:["climate"],stageMin:4,stageMax:12,weight:1,effect:{waterAvailability:10,seaLevel:5,averageTemperature:-2,nutrientIndex:4},text:"持续数千万年的全球降雨期开始了，洪流冲刷着年轻的岩层。"},
  {id:"clim_ice_age",title:"长冰期降临",tags:["climate","disaster"],stageMin:4,stageMax:15,weight:0.7,effect:{averageTemperature:-15,seaLevel:-8,waterAvailability:-5,atmosphericStability:5},text:"行星轨道参数的微妙变化引发了一次漫长冰期，冰盖向赤道推进。"},
  {id:"clim_greenhouse",title:"温室增幅",tags:["climate"],stageMin:3,stageMax:14,weight:0.8,effect:{averageTemperature:10,atmospherePressure:0.2,seaLevel:3},text:"火山排放的温室气体在大气中累积，全球温度持续攀升。"},
  {id:"clim_sealevel_rise",title:"海平面抬升",tags:["climate"],stageMin:5,stageMax:14,weight:0.7,effect:{seaLevel:8,waterAvailability:5,averageTemperature:2},text:"极地冰层部分融化，海平面显著上升，沿岸地带被重新塑造。"},
  {id:"astro_meteorite",title:"陨石撞击",tags:["astro","disaster"],stageMin:1,stageMax:15,weight:0.5,effect:{tectonicActivity:8,averageTemperature:-5,atmosphericStability:-8,nutrientIndex:5},text:"一颗中型陨石撞入海盆，激起的碎片短暂遮蔽了大气。"},
  {id:"astro_comet_water",title:"彗星送水",tags:["astro"],stageMin:1,stageMax:8,weight:0.8,effect:{waterAvailability:15,seaLevel:8,averageTemperature:-2,nutrientIndex:5},text:"一群含水冰的彗星碎片坠入行星，带来了大量水资源和有机分子。"},
  {id:"astro_flare",title:"恒星耀斑",tags:["astro","disaster"],stageMin:1,stageMax:20,weight:0.6,effect:{radiationLevel:20,atmosphericStability:-10,biosignatureLevel:-3},text:"恒星突发高能粒子风暴，辐射急升，大气上层被强烈扰动。"},
  {id:"astro_tidal",title:"月卫潮汐共振",tags:["astro"],stageMin:3,stageMax:12,weight:0.7,effect:{tectonicActivity:4,waterAvailability:3,nutrientIndex:4},text:"卫星轨道共振加强了潮汐作用，海岸线上出现了丰富的潮汐滩涂。"},
  {id:"life_organic_film",title:"有机薄膜扩展",tags:["prelife"],stageMin:6,stageMax:9,weight:1,effect:{nutrientIndex:6,biosignatureLevel:3},text:"浅海岩石表面出现了一层肉眼难辨的有机薄膜，在阳光下缓慢扩展。"},
  {id:"life_deepchem",title:"深海化学群落",tags:["prelife"],stageMin:6,stageMax:10,weight:1,effect:{nutrientIndex:8,biosignatureLevel:5,tectonicActivity:2},text:"深海热泉周围形成了稳定的化学群落，循环着最原始的代谢网络。"},
  {id:"life_microbe_mat",title:"微生物席扩张",tags:["life"],stageMin:9,stageMax:12,weight:1,effect:{biosignatureLevel:8,oxygenLevel:2,nutrientIndex:3},text:"浅海和潮间带出现了大面积微生物席，它们开始缓慢改变大气成分。"},
  {id:"life_photosynthesis",title:"光合作用兴起",tags:["life"],stageMin:10,stageMax:12,weight:1.2,effect:{oxygenLevel:8,biosignatureLevel:10,atmosphericStability:5},text:"一种新型微生物学会了利用恒星光能，大规模释放氧气到大气中。"},
  {id:"life_mass_extinction",title:"大灭绝事件",tags:["life","disaster"],stageMin:10,stageMax:15,weight:0.4,effect:{biosignatureLevel:-15,oxygenLevel:-3,nutrientIndex:-5},text:"环境剧变引发了一次大规模物种灭绝，生态系统需要漫长时间重建。"},
  {id:"life_predation",title:"捕食行为出现",tags:["life"],stageMin:12,stageMax:14,weight:0.9,effect:{biosignatureLevel:6,nutrientIndex:2},text:"某些生物开始主动捕食其他生命体，生态链的复杂度急剧提升。"},
];

const CIVILIZATION_EVENTS = [
  {id:"civ_migration",title:"大规模迁徙潮",tags:["society"],stageMin:16,stageMax:22,weight:1,civEffect:{populationScale:2,explorationDrive:4,politicalStability:-3},text:"气候变化或资源压力推动了一次大规模群体迁徙。"},
  {id:"civ_education",title:"教育制度建立",tags:["society"],stageMin:20,stageMax:27,weight:0.8,civEffect:{knowledgeLevel:5,socialComplexity:3,culturalCohesion:2},text:"系统化的知识传承制度开始在主要聚落中建立。"},
  {id:"civ_civil_war",title:"内部冲突爆发",tags:["politics","disaster"],stageMin:18,stageMax:28,weight:0.5,civEffect:{warTension:12,politicalStability:-8,populationScale:-2},text:"资源争夺和权力斗争引发了大规模内部冲突。"},
  {id:"civ_alliance",title:"城邦结盟",tags:["politics"],stageMin:21,stageMax:24,weight:0.9,civEffect:{politicalStability:5,culturalCohesion:3,warTension:-4},text:"多个城邦签订了互助条约，形成了早期联盟雏形。"},
  {id:"civ_reform",title:"宪制改革",tags:["politics"],stageMin:22,stageMax:28,weight:0.7,civEffect:{politicalStability:6,socialComplexity:4,warTension:-3},text:"统治阶层在压力下推行了一系列权力制衡改革。"},
  {id:"civ_metallurgy",title:"冶金突破",tags:["tech"],stageMin:17,stageMax:24,weight:1,civEffect:{technologyLevel:6,resourcePressure:4,explorationDrive:2},text:"冶炼温度第一次被稳定控制在临界区间，工具开始可以被设计。"},
  {id:"civ_steam",title:"蒸汽动力突破",tags:["tech"],stageMin:24,stageMax:26,weight:1,civEffect:{technologyLevel:8,resourcePressure:6,ecologicalBalance:-5},text:"高密度能源机器第一次投入规模化生产。"},
  {id:"civ_computing",title:"计算革命",tags:["tech"],stageMin:26,stageMax:28,weight:1,civEffect:{technologyLevel:6,knowledgeLevel:5,automationLevel:4},text:"数字计算能力呈指数级增长，信息处理方式被彻底改变。"},
  {id:"civ_orbital",title:"轨道发射成功",tags:["tech"],stageMin:28,stageMax:31,weight:0.8,civEffect:{spaceCapability:8,technologyLevel:4,explorationDrive:6},text:"第一个人造物体成功进入稳定轨道，文明抬头仰望的方式发生了改变。"},
  {id:"civ_deforestation",title:"大规模土地退化",tags:["ecology","disaster"],stageMin:20,stageMax:27,weight:0.6,civEffect:{ecologicalBalance:-10,resourcePressure:8,populationScale:-1},text:"过度开垦和伐木导致大片土地失去生产力。"},
  {id:"civ_eco_restore",title:"生态修复运动",tags:["ecology"],stageMin:25,stageMax:30,weight:0.7,civEffect:{ecologicalBalance:8,culturalCohesion:3,resourcePressure:-4},text:"面对环境恶化，一场大规模的生态修复运动蔓延开来。"},
  {id:"civ_plague",title:"瘟疫爆发",tags:["disaster"],stageMin:19,stageMax:27,weight:0.4,civEffect:{populationScale:-5,politicalStability:-4,warTension:3},text:"一种高传染性疾病在密集聚落中迅速蔓延。"},
  {id:"civ_famine",title:"大范围饥荒",tags:["disaster"],stageMin:19,stageMax:26,weight:0.4,civEffect:{populationScale:-4,resourcePressure:10,warTension:6,politicalStability:-5},text:"连续多季歉收引发了大范围饥荒，社会秩序面临严峻考验。"},
  {id:"civ_philosophy",title:"哲学黄金期",tags:["thought"],stageMin:22,stageMax:26,weight:0.8,civEffect:{spiritualDepth:6,knowledgeLevel:4,culturalCohesion:3},text:"多个思想流派同时兴起，关于存在、伦理和宇宙的讨论空前活跃。"},
  {id:"civ_scientific_method",title:"科学方法诞生",tags:["thought","tech"],stageMin:23,stageMax:26,weight:1,civEffect:{knowledgeLevel:8,technologyLevel:4,spiritualDepth:2},text:"系统化的实验与验证方法被确立，知识积累从此加速。"},
  {id:"civ_global_network",title:"全球通信网络打通",tags:["tech"],stageMin:26,stageMax:28,weight:1,civEffect:{knowledgeLevel:5,culturalCohesion:2,politicalStability:1},text:"跨越大陆的即时通信网络首次连通，信息传播速度超越地理扩张速度。"},
  {id:"civ_ai_platform",title:"AI 协作平台诞生",tags:["tech"],stageMin:27,stageMax:29,weight:0.9,civEffect:{automationLevel:8,technologyLevel:4,politicalStability:2},text:"智能代理开始参与决策链，文明效率与风险同步上升。"},
  {id:"civ_space_accident",title:"近轨发射事故",tags:["disaster","tech"],stageMin:28,stageMax:31,weight:0.4,civEffect:{spaceCapability:-4,politicalStability:-3,explorationDrive:-2},text:"一次严重的太空事故引发了对航天计划的质疑和反思。"},
  {id:"civ_unified_calendar",title:"统一历法建立",tags:["society"],stageMin:20,stageMax:23,weight:0.8,civEffect:{knowledgeLevel:5,socialComplexity:4,culturalCohesion:3},text:"不同区域第一次采用统一的时间计量方式。"},
  {id:"civ_river_bounty",title:"大河丰年",tags:["ecology"],stageMin:19,stageMax:23,weight:1,civEffect:{populationScale:4,politicalStability:2,resourcePressure:-6,ecologicalBalance:2},text:"主要河流域迎来了连续数季的丰水年，粮仓充盈。"},
];

// ── 关键抉择池 ──
const CHOICE_POOL = [
  {id:"ch_comet_water",stageMin:3,stageMax:8,prompt:"一群含冰彗星正在接近轨道。是否引导它们补水？",options:[
    {label:"引导小型彗星进入外层轨道",apply:w=>{w.parameters.waterAvailability+=10;w.parameters.seaLevel+=6;w.parameters.radiationLevel+=3;},result:"水资源稳步增加，但轨道扰动带来了轻微辐射风险。"},
    {label:"保持轨道稳定，拒绝外来干涉",apply:w=>{w.parameters.atmosphericStability+=5;},result:"大气稳定性得到保障，但补水机会就此错过。"},
    {label:"一次性大规模送水",apply:w=>{w.parameters.waterAvailability+=20;w.parameters.seaLevel+=12;w.parameters.tectonicActivity+=8;},result:"海洋迅速扩张，但剧烈撞击扰动了地壳。"}
  ]},
  {id:"ch_flare_shield",stageMin:5,stageMax:12,prompt:"恒星耀斑频发，生命窗口受到威胁。你要如何应对？",options:[
    {label:"高维遮蔽部分粒子风",apply:w=>{w.parameters.radiationLevel-=12;},result:"辐射威胁大幅降低，但自然突变率也随之下降。"},
    {label:"不干预，保留自然突变",apply:w=>{w.parameters.radiationLevel+=8;},result:"生命将在更高辐射中演化，创新事件权重上升。"},
    {label:"仅保护极区磁层",apply:w=>{w.parameters.atmosphericStability+=4;w.parameters.radiationLevel-=4;},result:"极区成为生态避难所，局部生态有更高存活概率。"}
  ]},
  {id:"ch_prelife_env",stageMin:6,stageMax:9,prompt:"前生命化学体系正在积累，你希望加速哪个方向？",options:[
    {label:"稳定海洋循环，降低风险",apply:w=>{w.parameters.atmosphericStability+=6;w.parameters.nutrientIndex+=4;},result:"环境更加稳定，前生命系统有更多时间积累。"},
    {label:"允许超级火山重塑大气",apply:w=>{w.parameters.tectonicActivity+=10;w.parameters.nutrientIndex+=8;w.parameters.averageTemperature+=5;},result:"化学循环加速，但风险也随之提升。"}
  ]},
  {id:"ch_agriculture_surplus",stageMin:20,stageMax:21,prompt:"农业剩余出现后，如何分配？",options:[
    {label:"建立公共粮仓",apply:w=>{w.civilization.politicalStability+=5;w.civilization.culturalCohesion+=3;w.civilization.resourcePressure-=4;},result:"社会凝聚力提升，抗灾能力增强。"},
    {label:"各聚落自行储备",apply:w=>{w.civilization.socialComplexity+=2;w.civilization.explorationDrive+=3;},result:"地区差异化加大，独立性增强。"},
    {label:"精英集中控制剩余",apply:w=>{w.civilization.technologyLevel+=2;w.civilization.politicalStability-=3;w.civilization.warTension+=4;},result:"资源集中推动了技术发展，但埋下了不平等的种子。"}
  ]},
  {id:"ch_writing_unity",stageMin:21,stageMax:22,prompt:"第一套文字系统诞生后，是否统一？",options:[
    {label:"强制标准化",apply:w=>{w.civilization.culturalCohesion+=5;w.civilization.socialComplexity+=4;},result:"沟通效率大幅提升，但地方多样性削弱。"},
    {label:"允许多文字并存",apply:w=>{w.civilization.spiritualDepth+=3;w.civilization.knowledgeLevel+=2;},result:"文化更加繁荣多元，但跨区域交流成本增加。"},
    {label:"文字只保留给祭司阶层",apply:w=>{w.civilization.knowledgeLevel+=1;w.civilization.politicalStability-=2;w.civilization.warTension+=2;},result:"知识被垄断，阶层固化倾向加强。"}
  ]},
  {id:"ch_industrial_pollution",stageMin:25,stageMax:26,prompt:"工业化带来的污染是否要立刻治理？",options:[
    {label:"先发展后治理",apply:w=>{w.civilization.technologyLevel+=5;w.civilization.populationScale+=3;w.civilization.ecologicalBalance-=10;},result:"工业效率暴涨，但生态代价沉重。"},
    {label:"同步治理",apply:w=>{w.civilization.ecologicalBalance-=4;w.civilization.politicalStability+=2;},result:"发展速度适中，社会关系相对稳定。"},
    {label:"严格限产保生态",apply:w=>{w.civilization.ecologicalBalance+=5;w.civilization.technologyLevel-=2;w.civilization.resourcePressure+=4;},result:"生态得到保护，但经济增长放缓。"}
  ]},
  {id:"ch_network_open",stageMin:27,stageMax:28,prompt:"网络社会如何治理？",options:[
    {label:"全面开放",apply:w=>{w.civilization.knowledgeLevel+=6;w.civilization.politicalStability-=2;},result:"创新爆发但信息失序风险上升。"},
    {label:"受控开放",apply:w=>{w.civilization.politicalStability+=3;w.civilization.knowledgeLevel+=3;},result:"稳定与创新之间取得了平衡。"},
    {label:"高度集中管理",apply:w=>{w.civilization.politicalStability+=4;w.civilization.culturalCohesion-=2;},result:"秩序井然但创造力受到抑制。"}
  ]},
  {id:"ch_ai_autonomy",stageMin:28,stageMax:29,prompt:"智能系统是否拥有自治权？",options:[
    {label:"只作为工具",apply:w=>{w.civilization.automationLevel+=4;w.civilization.politicalStability+=2;},result:"效率稳步提升，控制权牢牢在手。"},
    {label:"允许有限自治",apply:w=>{w.civilization.automationLevel+=7;w.civilization.technologyLevel+=3;},result:"技术飞跃但价值冲突开始浮现。"},
    {label:"与智慧系统共同治理",apply:w=>{w.civilization.automationLevel+=10;w.civilization.civilizationSignal+=3;},result:"文明进入未知领域，飞跃概率提升。"}
  ]},
  {id:"ch_deep_space_signal",stageMin:29,stageMax:31,prompt:"是否主动向深空广播文明信号？",options:[
    {label:"主动广播",apply:w=>{w.civilization.civilizationSignal+=8;w.civilization.explorationDrive+=5;},result:"信号已发出，宇宙是否回应尚不可知。"},
    {label:"保持沉默",apply:w=>{w.civilization.politicalStability+=2;w.civilization.explorationDrive-=1;},result:"文明选择了谨慎，在黑暗中静默观察。"},
    {label:"只向近邻定向发送",apply:w=>{w.civilization.civilizationSignal+=4;w.civilization.spaceCapability+=2;},result:"精准而克制的信号被送向最近的恒星系。"}
  ]},
  {id:"ch_war_intervention",stageMin:22,stageMax:24,prompt:"一场可能改变格局的战争即将爆发。你要干预吗？",options:[
    {label:"压制冲突，维持和平",apply:w=>{w.civilization.warTension-=8;w.civilization.politicalStability+=4;},result:"战争被避免，但整合速度放缓。"},
    {label:"不干预，让历史自行选择",apply:w=>{w.civilization.warTension+=4;w.civilization.socialComplexity+=3;},result:"冲突带来了痛苦，也加速了制度演化。"}
  ]},
  {id:"ch_space_priority",stageMin:29,stageMax:31,prompt:"太空探索应该采取什么策略？",options:[
    {label:"集中全球资源冲刺太空",apply:w=>{w.civilization.spaceCapability+=10;w.civilization.resourcePressure+=5;},result:"太空能力飞速提升，但母星资源紧张。"},
    {label:"先解决母星生态",apply:w=>{w.civilization.ecologicalBalance+=8;w.civilization.spaceCapability+=2;},result:"母星环境改善，太空计划稳步推进。"},
    {label:"优先无人探索",apply:w=>{w.civilization.spaceCapability+=6;w.civilization.automationLevel+=3;},result:"风险更低，但缺少了直接参与的激励。"}
  ]},
];

// ── 简报模板 ──
const REPORT_STYLES = [
  {id:"scientific",tag:"science",title:s=>`【观测播报】${s.name}`,fmt:(s,h,ev,pd)=>`现实历时：${h}\n演化折算：约 ${pd}\n阶段变化：${s.name}\n${ev}`},
  {id:"journal",tag:"narrative",title:s=>`【观测日志 #${String(Math.floor(Math.random()*999)).padStart(3,'0')}】`,fmt:(s,h,ev,pd)=>`${ev}\n\n这颗星球已经走过了相当于 ${pd} 的漫长岁月。`},
  {id:"alert",tag:"alert",title:s=>`【异常警报】`,fmt:(s,h,ev,pd)=>`观测站在本次结算中检测到异常变化。\n\n${ev}\n\n建议密切关注后续发展。`},
  {id:"data_panel",tag:"data",title:s=>`【参数面板更新】`,fmt:(s,h,ev,pd)=>`本次结算：${h}\n折算：${pd}\n${ev}`},
  {id:"whisper",tag:"narrative",title:s=>`【站内低语】`,fmt:(s,h,ev,pd)=>`你离开时这里还是另一番模样。\n在你不在的这段时间里——\n\n${ev}`},
  {id:"civ_memo",tag:"civilization",title:s=>`【文明纪要】`,fmt:(s,h,ev,pd)=>`${ev}\n\n现实 ${h}，对他们而言已是 ${pd}。`},
  {id:"thought_echo",tag:"thought",title:s=>`【思想回声】`,fmt:(s,h,ev,pd)=>`${ev}\n\n思想的火花在寂静中闪烁了 ${pd}。`},
  {id:"deep_space",tag:"space",title:s=>`【深空前夜】`,fmt:(s,h,ev,pd)=>`${ev}\n\n他们第一次不再把星辰只当作寓言背景。`},
];

// ════════════════════════════════════════
// 成就系统 (v1.2)
// ════════════════════════════════════════
const ACHIEVEMENT_DEFS = [
  // ── 通用推进成就 ──
  {id:"ach_first_water",name:"初始之水",category:"universal",rarity:"common",stageKeys:["ocean_ice_forming"],planetTypes:null,hiddenUntilUnlock:false,icon:"💧",description:"液态水第一次出现在这颗星球上，海洋的雏形开始凝聚。",conditionText:"进入海洋/冰层定型阶段",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===5},
  {id:"ach_first_life",name:"生命之火",category:"universal",rarity:"common",stageKeys:["first_life"],planetTypes:null,hiddenUntilUnlock:false,icon:"🦠",description:"在无尽的沉寂后，第一个能自我复制的微小生命体终于出现了。",conditionText:"进入第一生命阶段",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===9},
  {id:"ach_first_civ",name:"文明之光",category:"universal",rarity:"common",stageKeys:["primitive_groups"],planetTypes:null,hiddenUntilUnlock:false,icon:"👣",description:"这颗星球上的生命不再只是被动适应环境——他们开始有意识地改变世界。",conditionText:"进入原始群体时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===16},
  {id:"ach_agriculture",name:"播种者",category:"universal",rarity:"common",stageKeys:["agriculture"],planetTypes:null,hiddenUntilUnlock:false,icon:"🌾",description:"第一次有意识地种植作物，文明从此拥有了稳定的食物来源。",conditionText:"进入农耕/驯化时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===20},
  {id:"ach_writing",name:"刻字者",category:"universal",rarity:"common",stageKeys:["city_writing"],planetTypes:null,hiddenUntilUnlock:false,icon:"📜",description:"第一套文字系统被创造出来，思想从此可以跨越时间流传。",conditionText:"进入城邦与文字时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===21},
  {id:"ach_industry",name:"铁与烟",category:"universal",rarity:"common",stageKeys:["industrial"],planetTypes:null,hiddenUntilUnlock:false,icon:"🏭",description:"蒸汽与钢铁改变了一切，产量、速度、污染同步爆发。",conditionText:"进入工业革命时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===25},
  {id:"ach_network",name:"全球互联",category:"universal",rarity:"common",stageKeys:["information"],planetTypes:null,hiddenUntilUnlock:false,icon:"🌐",description:"信息网络覆盖全球，每一个角落都被连接在一起。",conditionText:"进入信息网络时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===27},
  {id:"ach_space",name:"仰望者",category:"universal",rarity:"common",stageKeys:["space_exploration"],planetTypes:null,hiddenUntilUnlock:false,icon:"🚀",description:"文明第一次将自己的造物送入轨道，星空不再只是背景。",conditionText:"进入太空探索时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===29},
  {id:"ach_interstellar",name:"星际黎明",category:"universal",rarity:"epic",stageKeys:["interstellar_dawn"],planetTypes:null,hiddenUntilUnlock:true,icon:"✨",description:"文明迈过了宇宙文明的门槛，星际旅程的序幕正式拉开。",conditionText:"进入星际萌芽时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===31},

  // ── 稀有事件成就 ──
  {id:"ach_deep_chem_garden",name:"深海化学花园",category:"rare_event",rarity:"rare",stageKeys:["organic_enrichment","prebiotic_system"],planetTypes:null,hiddenUntilUnlock:true,icon:"🌺",description:"在深海热泉周围，矿物晶体与有机分子交织成奇异的化学花园，那是生命萌芽前最美的沉默。",conditionText:"触发深海热泉群扩张事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="geo_hotspring")},
  {id:"ach_comet_rain",name:"彗星之雨",category:"rare_event",rarity:"rare",stageKeys:["nebula_accretion","molten_barren","crust_forming"],planetTypes:null,hiddenUntilUnlock:true,icon:"☄️",description:"天降冰雨，为这颗干渴的星球带来了大量水资源。",conditionText:"触发彗星送水事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="astro_comet_water")},
  {id:"ach_photosynthesis",name:"氧气革命",category:"rare_event",rarity:"rare",stageKeys:["metabolic_revolution"],planetTypes:null,hiddenUntilUnlock:false,icon:"🌿",description:"光合作用的兴起彻底改变了大气成分，为复杂生命铺平了道路。",conditionText:"触发光合作用兴起事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="life_photosynthesis")},
  {id:"ach_mass_extinction",name:"大灭绝幸存者",category:"rare_event",rarity:"epic",stageKeys:["microbe_spread","metabolic_revolution","complex_cells","multicellular","higher_species"],planetTypes:null,hiddenUntilUnlock:true,icon:"💀",description:"一场大灭绝席卷了整个星球，但生命在废墟中重新站了起来。",conditionText:"触发大灭绝事件后生命依然存续",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="life_mass_extinction")&&w.parameters.biosignatureLevel>5},
  {id:"ach_supervolcano",name:"灰烬纪元",category:"rare_event",rarity:"rare",stageKeys:["molten_barren","crust_forming","primitive_atmosphere"],planetTypes:null,hiddenUntilUnlock:true,icon:"🌋",description:"超级火山的怒吼遮蔽了天空，整个星球陷入漫长的寒冬。",conditionText:"触发超级火山爆发事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="geo_supervolcano")},
  {id:"ach_philosophy",name:"思想的黄金时代",category:"rare_event",rarity:"rare",stageKeys:["kingdom_alliance","philosophy_sailing","craft_revolution"],planetTypes:null,hiddenUntilUnlock:false,icon:"📖",description:"哲人们在星空下辩论存在的意义，这是文明精神最灿烂的年代。",conditionText:"触发哲学黄金期事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="civ_philosophy")},
  {id:"ach_orbital_launch",name:"破天之箭",category:"rare_event",rarity:"rare",stageKeys:["ai_collaboration","space_exploration"],planetTypes:null,hiddenUntilUnlock:false,icon:"🛰️",description:"第一枚火箭划破大气层，文明从此不再被困在一颗星球上。",conditionText:"触发轨道发射成功事件",check:(w,ctx)=>ctx.events&&ctx.events.some(e=>e.id==="civ_orbital")},

  // ── 抉择成就 ──
  {id:"ach_ch_comet_flood",name:"洪水创世",category:"choice",rarity:"rare",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"🌊",description:"你选择了一次性大规模送水，海洋在冲击中诞生。",conditionText:"选择一次性大规模送水",check:(w,ctx)=>ctx.choiceId==="ch_comet_water"&&ctx.choiceLabel==="一次性大规模送水"},
  {id:"ach_ch_mutation",name:"突变之路",category:"choice",rarity:"rare",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"☢️",description:"你选择不干预辐射，让生命在更危险的环境中演化。",conditionText:"选择不干预保留自然突变",check:(w,ctx)=>ctx.choiceId==="ch_flare_shield"&&ctx.choiceLabel==="不干预，保留自然突变"},
  {id:"ach_ch_public_granary",name:"公共粮仓",category:"choice",rarity:"common",stageKeys:[],planetTypes:null,hiddenUntilUnlock:false,icon:"🏛️",description:"你选择了共享的粮仓，社会在互助中走向稳定。",conditionText:"选择建立公共粮仓",check:(w,ctx)=>ctx.choiceId==="ch_agriculture_surplus"&&ctx.choiceLabel==="建立公共粮仓"},
  {id:"ach_ch_open_network",name:"开放网络",category:"choice",rarity:"rare",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"📡",description:"你选择了全面开放的网络，创新与混乱共存。",conditionText:"选择全面开放网络",check:(w,ctx)=>ctx.choiceId==="ch_network_open"&&ctx.choiceLabel==="全面开放"},
  {id:"ach_ch_ai_cogovern",name:"共治时代",category:"choice",rarity:"epic",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"🤝",description:"你允许智能系统与文明共同治理，命运从此交织。",conditionText:"选择与智慧系统共同治理",check:(w,ctx)=>ctx.choiceId==="ch_ai_autonomy"&&ctx.choiceLabel==="与智慧系统共同治理"},
  {id:"ach_ch_broadcast",name:"向深空呼喊",category:"choice",rarity:"epic",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"📢",description:"你选择主动向宇宙广播文明的存在。信号已出发，永不返回。",conditionText:"选择主动向深空广播",check:(w,ctx)=>ctx.choiceId==="ch_deep_space_signal"&&ctx.choiceLabel==="主动广播"},
  {id:"ach_ch_silence",name:"黑暗中的沉默",category:"choice",rarity:"rare",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"🤫",description:"面对浩瀚宇宙，文明选择了沉默。",conditionText:"选择保持沉默",check:(w,ctx)=>ctx.choiceId==="ch_deep_space_signal"&&ctx.choiceLabel==="保持沉默"},

  // ── 行星专属成就 ──
  {id:"ach_ocean_tidal",name:"潮汐帝国",category:"planet_special",rarity:"epic",stageKeys:["city_writing","kingdom_alliance"],planetTypes:["ocean","moon"],hiddenUntilUnlock:true,icon:"🏰",description:"他们没有依靠大陆，而是在潮汐与海沟之间建立了第一套真正跨代延续的海洋城邦秩序。",conditionText:"海洋/卫星行星 + 进入城邦时代 + 文化凝聚 > 15",check:(w,ctx)=>ctx.stageAdvanced&&(w.currentStage===21||w.currentStage===22)&&(w.planetType==="ocean"||w.planetType==="moon")&&w.civilization.culturalCohesion>15},
  {id:"ach_desert_oasis",name:"追逐绿洲的王朝",category:"planet_special",rarity:"epic",stageKeys:["kingdom_alliance"],planetTypes:["desert"],hiddenUntilUnlock:true,icon:"🏜️",description:"在干旱的沙海中，他们学会了追随水源建立移动的王朝。",conditionText:"沙漠行星 + 进入王国时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===22&&w.planetType==="desert"},
  {id:"ach_ice_undershell",name:"冰壳下的誓言",category:"planet_special",rarity:"epic",stageKeys:["first_life","microbe_spread"],planetTypes:["ice"],hiddenUntilUnlock:true,icon:"❄️",description:"在冰层之下的黑暗海洋中，生命悄然诞生，对抗着永恒的严寒。",conditionText:"冰封行星 + 第一生命诞生",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===9&&w.planetType==="ice"},
  {id:"ach_volcanic_forge",name:"熔岩工匠",category:"planet_special",rarity:"rare",stageKeys:["tool_emergence","tribal_totem"],planetTypes:["volcanic"],hiddenUntilUnlock:true,icon:"⚒️",description:"在火山行星上，文明学会了直接利用地热和熔岩来锻造工具。",conditionText:"火山行星 + 进入工具萌发时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===17&&w.planetType==="volcanic"},
  {id:"ach_swamp_canopy",name:"树冠城市",category:"planet_special",rarity:"epic",stageKeys:["settlement","agriculture"],planetTypes:["swamp"],hiddenUntilUnlock:true,icon:"🌳",description:"在沼泽温室的密林中，文明建立了悬挂在巨树之间的空中城市。",conditionText:"沼泽行星 + 进入定居聚落时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===19&&w.planetType==="swamp"},
  {id:"ach_moon_tidal_cult",name:"潮汐教团",category:"planet_special",rarity:"epic",stageKeys:["tribal_totem","settlement"],planetTypes:["moon"],hiddenUntilUnlock:true,icon:"🌑",description:"在巨行星卫星上，文明围绕潮汐的规律建立了宗教与秩序。",conditionText:"巨行星卫星 + 进入部落图腾时代",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===18&&w.planetType==="moon"},

  // ── 分歧结局成就 ──
  {id:"ach_end_harvest_ring",name:"丰收之环",category:"branch_ending",rarity:"rare",stageKeys:["city_writing"],planetTypes:null,hiddenUntilUnlock:true,icon:"🌿",description:"农业被纳入长期平衡系统，社会进入稳态扩张。",conditionText:"从农耕进入城邦 + 生态平衡 > 50 + 资源压力 < 40",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===21&&w.civilization.ecologicalBalance>50&&w.civilization.resourcePressure<40},
  {id:"ach_end_granary_king",name:"被谷仓绑架的王朝",category:"branch_ending",rarity:"rare",stageKeys:["city_writing"],planetTypes:null,hiddenUntilUnlock:true,icon:"👑",description:"剩余资源造就了王权，也造就了饥荒与征服。",conditionText:"从农耕进入城邦 + 战争紧张 > 30 + 政治稳定 < 30",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===21&&w.civilization.warTension>30&&w.civilization.politicalStability<30},
  {id:"ach_end_iron_bloom",name:"铁与烟的繁荣",category:"branch_ending",rarity:"rare",stageKeys:["electric_comm"],planetTypes:null,hiddenUntilUnlock:true,icon:"⚙️",description:"工业化以惊人的速度改变了世界，留下了繁荣与废墟。",conditionText:"从工业进入电气 + 技术 > 30 + 生态 < 40",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===26&&w.civilization.technologyLevel>30&&w.civilization.ecologicalBalance<40},
  {id:"ach_end_green_industry",name:"绿色工业",category:"branch_ending",rarity:"epic",stageKeys:["electric_comm"],planetTypes:null,hiddenUntilUnlock:true,icon:"🌱",description:"工业化与生态保护取得了罕见的平衡。",conditionText:"从工业进入电气 + 生态 > 55",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===26&&w.civilization.ecologicalBalance>55},
  {id:"ach_end_silent_scholars",name:"沉默的深空学派",category:"branch_ending",rarity:"epic",stageKeys:["interstellar_dawn"],planetTypes:null,hiddenUntilUnlock:true,icon:"🔇",description:"文明选择在沉默中探索宇宙，不留下任何信号。",conditionText:"进入星际萌芽 + 文明信号 < 5",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===31&&w.civilization.civilizationSignal<5},
  {id:"ach_end_beacon",name:"宇宙灯塔",category:"branch_ending",rarity:"epic",stageKeys:["interstellar_dawn"],planetTypes:null,hiddenUntilUnlock:true,icon:"💡",description:"文明选择成为宇宙中的一座灯塔，持续向深空广播自己的存在。",conditionText:"进入星际萌芽 + 文明信号 > 10",check:(w,ctx)=>ctx.stageAdvanced&&w.currentStage===31&&w.civilization.civilizationSignal>10},

  // ── 长期观测成就 ──
  {id:"ach_10h",name:"十小时观测员",category:"universal",rarity:"common",stageKeys:[],planetTypes:null,hiddenUntilUnlock:false,icon:"⏰",description:"你已经累计观测了 10 小时。",conditionText:"累计观测 10 小时",check:(w,ctx)=>w.totalObservedMs>=36000000},
  {id:"ach_50h",name:"资深观测员",category:"universal",rarity:"rare",stageKeys:[],planetTypes:null,hiddenUntilUnlock:false,icon:"🔭",description:"50 小时的观测，你已经是一位资深观测员了。",conditionText:"累计观测 50 小时",check:(w,ctx)=>w.totalObservedMs>=180000000},
  {id:"ach_100h",name:"永恒的目光",category:"universal",rarity:"epic",stageKeys:[],planetTypes:null,hiddenUntilUnlock:true,icon:"👁️",description:"100 小时的注视，你已经和这颗星球建立了深厚的羁绊。",conditionText:"累计观测 100 小时",check:(w,ctx)=>w.totalObservedMs>=360000000},
];

// ════════════════════════════════════════
// 工具函数
// ════════════════════════════════════════
function clamp(v,min,max){return Math.min(max,Math.max(min,v));}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}
function rng(min,max){return min+Math.random()*(max-min);}
function genId(){return `w-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;}
function escapeHtml(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function formatHours(ms){
  const totalMin=Math.floor(ms/60000);
  if(totalMin<=0)return"不到 1 分钟";
  const d=Math.floor(totalMin/1440),h=Math.floor((totalMin%1440)/60),m=totalMin%60;
  const parts=[];
  if(d)parts.push(d+"天");
  if(h)parts.push(h+"小时");
  if(m)parts.push(m+"分钟");
  return parts.join("")||"不到 1 分钟";
}
function formatClock(totalSec){
  const s=Math.max(0,Math.floor(totalSec));
  return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function formatDateTime(ts){
  if(!ts)return"-";
  return new Date(ts).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
}
function formatDateShort(ts){
  if(!ts)return"-";
  const d=new Date(ts);
  return `${d.getFullYear()} 年 ${String(d.getMonth()+1).padStart(2,'0')} 月 ${String(d.getDate()).padStart(2,'0')} 日`;
}
function formatDurationMinutes(min){
  if(min<60) return min+" 分钟";
  const h=Math.floor(min/60), m=min%60;
  return m>0?`${h} 小时 ${m} 分钟`:`${h} 小时`;
}
function formatCosmicTime(totalHoursReal, stageId){
  const stage=STAGES.find(s=>s.id===stageId)||STAGES[0];
  const sIdx=STAGES.indexOf(stage);
  let yearsPerHour;
  if(sIdx<=5) yearsPerHour=50000000;
  else if(sIdx<=9) yearsPerHour=5000000;
  else if(sIdx<=14) yearsPerHour=500000;
  else if(sIdx<=19) yearsPerHour=50000;
  else if(sIdx<=23) yearsPerHour=5000;
  else if(sIdx<=25) yearsPerHour=50;
  else if(sIdx<=27) yearsPerHour=5;
  else yearsPerHour=1;
  const years=totalHoursReal*yearsPerHour;
  if(years>=1e8) return `${(years/1e8).toFixed(1)} 亿年`;
  if(years>=1e4) return `${(years/1e4).toFixed(1)} 万年`;
  if(years>=1) return `${Math.round(years)} 年`;
  return `${Math.max(1,Math.round(years*365))} 天`;
}

// ════════════════════════════════════════
// 状态管理
// ════════════════════════════════════════
function getDefaultState(){
  return {
    version:"1.2",
    observerSince:Date.now(),
    lifetimeMs:0,
    theme:"nebula",
    recentLogs:[],
    world:null,
    setupNotice:""
  };
}

function createWorld(planetType,starSystem,lifeBias,durationMin){
  const params=getInitialParameters(planetType,starSystem,lifeBias);
  return {
    id:genId(), createdAt:Date.now(),
    planetType, starSystemType:starSystem, lifeBias,
    // v1.2: 观测周期配置
    observationConfig:{
      selectedDurationMinutes: durationMin,
      cycleTargetMs: durationMin*60000
    },
    // v1.2: 周期状态
    cycleState:{
      cycleStartedAt:null,
      cyclePausedAt:null,
      cycleAccumulatedMs:0,
      cycleCompleted:false
    },
    // v1.2: 观测开始时间
    observationStartedAt:null,
    observationStartedYearText:null,

    hasStartedObservation:false,
    isObserving:false,
    lastActiveTimestamp:null,
    totalObservedMs:0,
    pendingObservedMs:0,
    currentStage:1,
    currentStageKey:"nebula_accretion",
    alive:true, extinctionReason:"",
    parameters:params,
    civilization:getInitialCivilization(),
    flags:{
      liquidWaterUnlocked:false,organicChemistryUnlocked:false,
      prebioticSystemUnlocked:false,firstLifeBorn:false,
      intelligentLifeBorn:false,civilizationUnlocked:false,
      agricultureUnlocked:false,writingUnlocked:false,
      industryUnlocked:false,networkUnlocked:false,
      aiUnlocked:false,orbitalLaunchUnlocked:false
    },
    traits:{ecology:0,tech:0,resilience:0,aggression:0,spirituality:0,cooperation:0},
    history:{
      seenReportIds:[],seenChoiceIds:[],recentEvents:[],
      keyDecisions:[],reportTagHistory:[],failedAdvances:0
    },
    currentReport:null,
    // v1.2: 成就
    achievements:{
      unlocked:[],
      seenAchievementIds:[],
      newlyUnlockedThisRound:[]
    }
  };
}

let state = loadState();
let activeView = "main";
let timerId = null;

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return getDefaultState();
    const parsed=JSON.parse(raw);
    return {...getDefaultState(),...parsed,recentLogs:Array.isArray(parsed.recentLogs)?parsed.recentLogs:[]};
  }catch{return getDefaultState();}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}

// ════════════════════════════════════════
// 时间逻辑 (v1.2 观测周期版)
// ════════════════════════════════════════
function getCycleElapsedMs(w){
  if(!w||!w.cycleState.cycleStartedAt) return 0;
  let acc=w.cycleState.cycleAccumulatedMs;
  if(w.isObserving&&w.lastActiveTimestamp){
    acc+=Math.max(0,Date.now()-w.lastActiveTimestamp);
  }
  return acc;
}

function isCycleComplete(w){
  if(!w||!w.cycleState.cycleStartedAt) return false;
  return getCycleElapsedMs(w)>=w.observationConfig.cycleTargetMs;
}

function getRunningDeltaMs(){
  const w=state.world;
  if(!w||!w.isObserving||!w.lastActiveTimestamp) return 0;
  return Math.max(0,Date.now()-w.lastActiveTimestamp);
}

function syncOfflineTime(){
  const w=state.world;
  if(!w||!w.hasStartedObservation||!w.isObserving) return;
  const now=Date.now();
  if(w.lastActiveTimestamp){
    const offlineMs=Math.max(0,now-w.lastActiveTimestamp);
    if(offlineMs>1000){
      w.totalObservedMs+=offlineMs;
      w.cycleState.cycleAccumulatedMs+=offlineMs;
    }
  }
  w.lastActiveTimestamp=now;
  // Check if cycle completed during offline
  if(getCycleElapsedMs(w)>=w.observationConfig.cycleTargetMs){
    w.cycleState.cycleCompleted=true;
  }
  saveState();
}

function startObservation(){
  const w=state.world;
  if(!w||!w.alive) return;
  if(w.currentReport&&w.currentReport.type==="choice"){activeView="report";render();return;}

  const now=Date.now();
  w.hasStartedObservation=true;
  w.isObserving=true;
  w.lastActiveTimestamp=now;

  if(!w.observationStartedAt){
    w.observationStartedAt=now;
    w.observationStartedYearText=formatDateShort(now);
  }

  // Start a new cycle if none active or previous completed
  if(!w.cycleState.cycleStartedAt||w.cycleState.cycleCompleted){
    w.cycleState={
      cycleStartedAt:now,
      cyclePausedAt:null,
      cycleAccumulatedMs:0,
      cycleCompleted:false
    };
    w.pendingObservedMs=0;
  }

  saveState();
  render();
}

function pauseObservation(){
  const w=state.world;
  if(!w||!w.isObserving) return;
  const delta=getRunningDeltaMs();
  if(delta>0){
    w.totalObservedMs+=delta;
    w.cycleState.cycleAccumulatedMs+=delta;
    state.lifetimeMs+=delta;
  }
  w.isObserving=false;
  w.cycleState.cyclePausedAt=Date.now();
  w.lastActiveTimestamp=null;
  // Check completion
  if(getCycleElapsedMs(w)>=w.observationConfig.cycleTargetMs){
    w.cycleState.cycleCompleted=true;
  }
  saveState();
  render();
}

function persistOnExit(){
  const w=state.world;
  if(!w) return;
  if(w.isObserving){
    const delta=getRunningDeltaMs();
    if(delta>0){
      w.totalObservedMs+=delta;
      w.cycleState.cycleAccumulatedMs+=delta;
      state.lifetimeMs+=delta;
    }
    w.lastActiveTimestamp=Date.now();
  }
  saveState();
}

// ════════════════════════════════════════
// 生命窗口 & 概率机制
// ════════════════════════════════════════
function isLifeWindowOpen(p){
  let score=0;
  if(p.atmospherePressure>=0.4&&p.atmospherePressure<=3.5) score++;
  if(p.averageTemperature>=-20&&p.averageTemperature<=80) score++;
  if(p.waterAvailability>=25) score++;
  if(p.seaLevel>=10&&p.seaLevel<=95) score++;
  if(p.radiationLevel<=70) score++;
  if(p.atmosphericStability>=30) score++;
  if(p.nutrientIndex>=35) score++;
  if(p.tectonicActivity>=15&&p.tectonicActivity<=85) score++;
  return score>=6;
}
function isHighQualityLifeWindow(p){
  return p.atmospherePressure>=0.7&&p.atmospherePressure<=2.2&&
    p.averageTemperature>=0&&p.averageTemperature<=45&&
    p.waterAvailability>=45&&p.radiationLevel<=45&&
    p.atmosphericStability>=50&&p.nutrientIndex>=50;
}

// ════════════════════════════════════════
// 自然推进 & 事件
// ════════════════════════════════════════
function applyNaturalProgression(w, deltaHours){
  const p=w.parameters, sIdx=w.currentStage;
  if(sIdx<=3){p.averageTemperature-=deltaHours*0.5;p.tectonicActivity-=deltaHours*0.3;p.atmosphericStability+=deltaHours*0.4;}
  if(sIdx>=4&&sIdx<=6){p.waterAvailability+=deltaHours*0.2;p.nutrientIndex+=deltaHours*0.3;p.atmosphericStability+=deltaHours*0.1;}
  if(sIdx>=9&&sIdx<=11){p.oxygenLevel+=deltaHours*0.15;p.biosignatureLevel+=deltaHours*0.4;}
  if(sIdx>=12) p.biosignatureLevel+=deltaHours*0.2;
  p.atmospherePressure=clamp(p.atmospherePressure,0.05,8);
  p.averageTemperature=clamp(p.averageTemperature,-180,220);
  p.seaLevel=clamp(p.seaLevel,0,100);
  p.waterAvailability=clamp(p.waterAvailability,0,100);
  p.oxygenLevel=clamp(p.oxygenLevel,0,40);
  p.radiationLevel=clamp(p.radiationLevel,0,100);
  p.tectonicActivity=clamp(p.tectonicActivity,0,100);
  p.atmosphericStability=clamp(p.atmosphericStability,0,100);
  p.nutrientIndex=clamp(p.nutrientIndex,0,100);
  p.biosignatureLevel=clamp(p.biosignatureLevel,0,100);
}

function applyCivProgression(w, deltaHours){
  if(w.currentStage<16) return;
  const c=w.civilization, sIdx=w.currentStage;
  c.populationScale=clamp(c.populationScale+deltaHours*0.1,0,100);
  c.socialComplexity=clamp(c.socialComplexity+deltaHours*0.08,0,100);
  c.knowledgeLevel=clamp(c.knowledgeLevel+deltaHours*0.06,0,100);
  if(sIdx>=24) c.technologyLevel=clamp(c.technologyLevel+deltaHours*0.05,0,100);
  if(sIdx>=27) c.automationLevel=clamp(c.automationLevel+deltaHours*0.04,0,100);
  if(sIdx>=29) c.spaceCapability=clamp(c.spaceCapability+deltaHours*0.03,0,100);
  c.resourcePressure=clamp(c.resourcePressure+deltaHours*0.02,0,100);
  if(sIdx>=25) c.ecologicalBalance=clamp(c.ecologicalBalance-deltaHours*0.02,0,100);
}

function runRandomEvents(w, deltaHours){
  const events=[];
  const pool=w.currentStage<16?NATURAL_EVENTS:CIVILIZATION_EVENTS;
  const applicable=pool.filter(e=>w.currentStage>=e.stageMin&&w.currentStage<=e.stageMax);
  if(applicable.length===0) return events;
  const count=deltaHours>=2?3:deltaHours>=0.5?2:1;
  for(let i=0;i<count;i++){
    const totalWeight=applicable.reduce((s,e)=>s+e.weight,0);
    let r=Math.random()*totalWeight,chosen=applicable[0];
    for(const e of applicable){r-=e.weight;if(r<=0){chosen=e;break;}}
    if(events.find(x=>x.id===chosen.id)) continue;
    if(chosen.effect){
      for(const[k,v] of Object.entries(chosen.effect)){
        if(w.parameters.hasOwnProperty(k)) w.parameters[k]=clamp(w.parameters[k]+v,k==='atmospherePressure'?0.05:k==='averageTemperature'?-180:0,k==='atmospherePressure'?8:k==='averageTemperature'?220:100);
      }
    }
    if(chosen.civEffect&&w.currentStage>=16){
      for(const[k,v] of Object.entries(chosen.civEffect)){
        if(w.civilization.hasOwnProperty(k)) w.civilization[k]=clamp(w.civilization[k]+v,0,100);
      }
    }
    events.push(chosen);
    w.history.recentEvents.unshift({id:chosen.id,title:chosen.title,at:Date.now()});
  }
  w.history.recentEvents=w.history.recentEvents.slice(0,20);
  return events;
}

// ════════════════════════════════════════
// 阶段推进
// ════════════════════════════════════════
function getStageObj(id){return STAGES.find(s=>s.id===id)||STAGES[0];}

function maybeAdvanceStage(w){
  const next=STAGES.find(s=>s.id===w.currentStage+1);
  if(!next) return false;
  const totalH=w.totalObservedMs/3600000;
  if(totalH<next.minHours) return false;
  if(next.id>=7&&next.id<=9){if(!isLifeWindowOpen(w.parameters)) return false;}
  if(next.id===9){if(!w.flags.prebioticSystemUnlocked) return false;}
  if(next.cat==="civ"&&next.id>=16){
    if(!w.flags.intelligentLifeBorn&&next.id>15) return false;
    const c=w.civilization;
    if(next.id>=20&&!w.flags.agricultureUnlocked&&next.id>20) return false;
    if(next.id>=21&&!w.flags.writingUnlocked&&next.id>21) return false;
    if(next.id>=20&&c.populationScale<10) return false;
    if(next.id>=25&&c.technologyLevel<20) return false;
    if(next.id>=27&&c.knowledgeLevel<40) return false;
    if(next.id>=28&&c.automationLevel<10) return false;
    if(next.id>=29&&c.spaceCapability<5) return false;
  }
  let chance=next.baseChance;
  if(next.id>=7&&next.id<=9&&isHighQualityLifeWindow(w.parameters)) chance+=0.06;
  if(next.cat==="civ"){
    const c=w.civilization;
    if(c.politicalStability>50) chance+=0.03;
    if(c.ecologicalBalance>60) chance+=0.02;
    if(c.warTension>50) chance-=0.04;
    if(c.resourcePressure>70) chance-=0.03;
  }
  chance+=w.history.failedAdvances*0.02;
  chance=clamp(chance,0.03,0.35);
  if(Math.random()<chance){
    w.currentStage=next.id;w.currentStageKey=next.key;w.history.failedAdvances=0;
    if(next.id===5) w.flags.liquidWaterUnlocked=true;
    if(next.id===6) w.flags.organicChemistryUnlocked=true;
    if(next.id===7) w.flags.prebioticSystemUnlocked=true;
    if(next.id===9) w.flags.firstLifeBorn=true;
    if(next.id===15){w.flags.intelligentLifeBorn=true;w.civilization=initCivilizationParams();w.flags.civilizationUnlocked=true;}
    if(next.id===20) w.flags.agricultureUnlocked=true;
    if(next.id===21) w.flags.writingUnlocked=true;
    if(next.id===25) w.flags.industryUnlocked=true;
    if(next.id===27) w.flags.networkUnlocked=true;
    if(next.id===28) w.flags.aiUnlocked=true;
    if(next.id===29) w.flags.orbitalLaunchUnlocked=true;
    return true;
  } else {
    w.history.failedAdvances++;
    if(w.history.failedAdvances>=6){
      if(next.cat==="life"){w.parameters.nutrientIndex=clamp(w.parameters.nutrientIndex+10,0,100);w.parameters.biosignatureLevel=clamp(w.parameters.biosignatureLevel+8,0,100);}
      if(next.cat==="civ"){w.civilization.knowledgeLevel=clamp(w.civilization.knowledgeLevel+5,0,100);w.civilization.technologyLevel=clamp(w.civilization.technologyLevel+3,0,100);}
    }
    return false;
  }
}

// ════════════════════════════════════════
// 成就检查 (v1.2)
// ════════════════════════════════════════
function checkAchievements(w, ctx){
  if(!w||!w.achievements) return [];
  const newlyUnlocked=[];
  const unlockedIds=w.achievements.unlocked.map(a=>a.id);
  for(const def of ACHIEVEMENT_DEFS){
    if(unlockedIds.includes(def.id)) continue;
    if(def.planetTypes&&!def.planetTypes.includes(w.planetType)) continue;
    try{
      if(def.check(w,ctx)){
        const record={id:def.id,unlockedAt:Date.now(),stageKey:w.currentStageKey,rarity:def.rarity};
        w.achievements.unlocked.push(record);
        newlyUnlocked.push(def);
      }
    }catch(e){}
  }
  return newlyUnlocked;
}

function showAchToast(def){
  const existing=document.querySelector('.ach-toast');
  if(existing) existing.remove();
  const toast=document.createElement('div');
  toast.className='ach-toast';
  const rarityLabel={common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]||'';
  toast.innerHTML=`<div class="toast-icon">${def.icon}</div><div class="toast-text"><h4>🏆 成就解锁：${escapeHtml(def.name)}</h4><p>${rarityLabel} · ${escapeHtml(def.description).slice(0,40)}…</p></div>`;
  document.body.appendChild(toast);
  setTimeout(()=>{if(toast.parentNode)toast.remove();},4200);
}

// ════════════════════════════════════════
// 简报生成 (v1.2 with cycle)
// ════════════════════════════════════════
function buildReport(w, deltaMs, events, stageAdvanced){
  const stage=getStageObj(w.currentStage);
  const deltaH=deltaMs/3600000;
  const hStr=formatHours(deltaMs);
  const cosmicStr=formatCosmicTime(deltaH,w.currentStage);
  let styles=[...REPORT_STYLES];
  if(stage.cat==="civ") styles=styles.filter(s=>s.tag!=="science"||Math.random()>0.5);
  const recentTags=w.history.reportTagHistory.slice(0,2);
  if(recentTags.length>=2&&recentTags[0]===recentTags[1]) styles=styles.filter(s=>s.tag!==recentTags[0]);
  if(styles.length===0) styles=[...REPORT_STYLES];
  const style=pick(styles);
  let evText=events.length>0?events.map(e=>e.text).join("\n\n"):(stageAdvanced?`星球演化进入了新的阶段：${stage.name}。`:"参数在缓慢变化中，一切仍在预期范围内。");
  const title=style.title(stage);
  const text=style.fmt(stage,hStr,evText,cosmicStr);
  let paramSummary=`气压 ${w.parameters.atmospherePressure.toFixed(1)} atm · 温度 ${w.parameters.averageTemperature.toFixed(0)}℃ · 海平面 ${w.parameters.seaLevel.toFixed(0)}% · 辐射 ${w.parameters.radiationLevel.toFixed(0)}`;
  if(w.currentStage>=9) paramSummary+=` · 生物迹象 ${w.parameters.biosignatureLevel.toFixed(0)}`;
  w.history.reportTagHistory.unshift(style.tag);
  w.history.reportTagHistory=w.history.reportTagHistory.slice(0,10);
  w.history.seenReportIds.push(style.id+"-"+Date.now());
  return {type:stageAdvanced?"stage_advance":"brief",title,text:text+"\n\n"+paramSummary,meta:`${stage.icon} ${stage.name}`,icon:stage.icon,stageAdvanced};
}

function getApplicableChoice(w){
  const applicable=CHOICE_POOL.filter(ch=>w.currentStage>=ch.stageMin&&w.currentStage<=ch.stageMax&&!w.history.seenChoiceIds.includes(ch.id));
  return applicable.length>0?pick(applicable):null;
}

function generateStationReport(){
  const w=state.world;
  if(!w){activeView="setup";render();return;}
  if(!w.alive){activeView="report";render();return;}
  if(w.currentReport&&w.currentReport.type==="choice"){activeView="report";render();return;}

  // v1.2: Check cycle completion
  if(w.isObserving){
    const delta=getRunningDeltaMs();
    if(delta>0){
      w.totalObservedMs+=delta;
      w.cycleState.cycleAccumulatedMs+=delta;
      state.lifetimeMs+=delta;
    }
    w.lastActiveTimestamp=Date.now();
  }

  // Check if cycle is complete
  const cycleElapsed=getCycleElapsedMs(w);
  if(!w.hasStartedObservation||!w.cycleState.cycleStartedAt){
    w.currentReport={type:"idle",title:"🔭 暂无新观测变化",text:"先去开始观测积累时间，再回来查看简报。",meta:"待机",icon:"🔭"};
    saveState();activeView="report";render();return;
  }

  if(cycleElapsed<w.observationConfig.cycleTargetMs){
    const remaining=w.observationConfig.cycleTargetMs-cycleElapsed;
    w.currentReport={type:"idle",title:"⏳ 本轮观测尚未完成",text:`本轮观测正在进行中，当前已流逝 ${formatHours(cycleElapsed)} / 目标 ${formatDurationMinutes(w.observationConfig.selectedDurationMinutes)}。\n\n观测站暂不开放新的结算结果。\n还需 ${formatHours(remaining)} 可获得下一次观测结果。`,meta:"等待中",icon:"⏳"};
    saveState();activeView="report";render();return;
  }

  // v1.2: Cycle complete — settle using target duration only
  const settleMs=w.observationConfig.cycleTargetMs;
  const deltaH=settleMs/3600000;

  // Stop observation
  w.isObserving=false;
  w.lastActiveTimestamp=null;
  w.cycleState.cycleCompleted=true;
  w.pendingObservedMs=0;

  // 1. Natural progression
  applyNaturalProgression(w,deltaH);
  applyCivProgression(w,deltaH);
  // 2. Random events
  const events=runRandomEvents(w,deltaH);
  // 3. Stage advancement
  const advanced=maybeAdvanceStage(w);
  // 4. Build report
  const report=buildReport(w,settleMs,events,advanced);

  // 5. Check achievements
  const achCtx={stageAdvanced:advanced,events,choiceId:null,choiceLabel:null};
  const newAchs=checkAchievements(w,achCtx);
  w.achievements.newlyUnlockedThisRound=newAchs.map(a=>a.id);

  // 6. Check if choice should appear
  const shouldChoice=deltaH>=0.25||advanced||events.some(e=>e.tags&&e.tags.includes("disaster"));
  if(shouldChoice){
    const choice=getApplicableChoice(w);
    if(choice){
      report.type="choice";report.choiceId=choice.id;report.prompt=choice.prompt;report.options=choice.options;
      report.text+="\n\n"+choice.prompt;
    }
  }

  w.currentReport=report;
  state.recentLogs.unshift({title:report.title,text:report.text.slice(0,150),at:Date.now()});
  state.recentLogs=state.recentLogs.slice(0,15);
  saveState();
  activeView="report";
  render();

  // Show toasts for new achievements
  if(newAchs.length>0){
    newAchs.forEach((a,i)=>setTimeout(()=>showAchToast(a),i*800));
  }
}

function resolveChoice(idx){
  const w=state.world;
  if(!w||!w.currentReport||w.currentReport.type!=="choice") return;
  const choice=CHOICE_POOL.find(c=>c.id===w.currentReport.choiceId);
  if(!choice) return;
  const option=choice.options[idx];
  if(!option) return;
  option.apply(w);
  w.history.seenChoiceIds.push(choice.id);
  w.history.keyDecisions.unshift({id:choice.id,label:option.label,at:Date.now()});

  // Check choice achievements
  const achCtx={stageAdvanced:false,events:[],choiceId:choice.id,choiceLabel:option.label};
  const newAchs=checkAchievements(w,achCtx);
  w.achievements.newlyUnlockedThisRound=(w.achievements.newlyUnlockedThisRound||[]).concat(newAchs.map(a=>a.id));

  w.currentReport={type:"result",title:"🧭 抉择已锁定",text:`你选择了：${option.label}\n\n${option.result}`,meta:"分支已记录",icon:"🧭"};
  state.recentLogs.unshift({title:option.label,text:option.result,at:Date.now()});
  saveState();render();

  if(newAchs.length>0){
    newAchs.forEach((a,i)=>setTimeout(()=>showAchToast(a),i*800));
  }
}

// ════════════════════════════════════════
// SVG 世界图案生成器 (v1.2 升级版 — 更大更精美)
// ════════════════════════════════════════
function renderWorldGlyph(w, size){
  if(!w) return '<div class="glyph-empty">尚未建立观测档案</div>';
  const S=size||360;
  const cx=S/2, cy=S/2, R=S*0.26;
  const p=w.parameters;
  const sIdx=w.currentStage;

  const planetPalette={
    rock:['#8b7355','#a08868','#6d5b42','#c4a97d'],
    ocean:['#1a5276','#2980b9','#154360','#5dade2'],
    desert:['#c2a060','#d4b87a','#a0833b','#e8d5a8'],
    ice:['#a8d8ea','#c5e8f7','#7fb3d3','#e0f0fa'],
    volcanic:['#8b2500','#d45500','#5c1a00','#ff6b2e'],
    swamp:['#3d6b34','#5a7a3a','#2d5225','#7ba84a'],
    moon:['#6b6b7b','#888899','#4a4a5e','#a0a0b2']
  };
  const colors=planetPalette[w.planetType]||planetPalette.rock;

  const starPalette={
    red_dwarf:['#ff6644','#cc4422'],sun_like:['#ffdd44','#ffbb22'],
    binary:['#aa88ff','#7755cc'],blue_white:['#66bbff','#3388dd'],
    old_orange:['#ff9944','#dd7722']
  };
  const sc=starPalette[w.starSystemType]||starPalette.sun_like;

  // Build surface features
  let surfacePaths='';
  const seed=w.id?w.id.charCodeAt(4):42;
  // Continent/ocean shapes
  if(w.planetType==='ocean'){
    const islandCount=3+Math.floor(p.seaLevel/30);
    for(let i=0;i<islandCount;i++){
      const a=(seed*37+i*97)%360*Math.PI/180;
      const r2=R*0.3+((seed*i*13)%30)/100*R*0.4;
      const ix=cx+Math.cos(a)*r2, iy=cy+Math.sin(a)*r2;
      const ir=3+((seed+i*7)%8);
      surfacePaths+=`<circle cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" r="${ir}" fill="${colors[3]}" opacity="0.5"/>`;
    }
    // Deep ocean shimmer
    surfacePaths+=`<ellipse cx="${cx-R*0.2}" cy="${cy+R*0.1}" rx="${R*0.5}" ry="${R*0.35}" fill="rgba(30,80,160,0.3)"/>`;
  } else if(w.planetType==='desert'){
    // Dune patterns
    for(let i=0;i<5;i++){
      const dy=cy-R*0.5+i*R*0.22;
      const amp=5+((seed+i*3)%8);
      surfacePaths+=`<path d="M${cx-R*0.7} ${dy} Q${cx-R*0.2} ${dy-amp} ${cx} ${dy} T${cx+R*0.7} ${dy}" fill="none" stroke="${colors[3]}" stroke-width="2" opacity="0.4"/>`;
    }
  } else if(w.planetType==='ice'){
    // Ice cracks
    for(let i=0;i<4;i++){
      const sx=cx-R*0.4+((seed*i*11)%80)/100*R*0.8;
      const sy=cy-R*0.3+((seed*i*7)%60)/100*R*0.6;
      surfacePaths+=`<line x1="${sx}" y1="${sy}" x2="${sx+((seed+i)%20)-10}" y2="${sy+15+((seed+i)%10)}" stroke="rgba(200,230,255,0.6)" stroke-width="1.5"/>`;
    }
    // Polar caps
    surfacePaths+=`<ellipse cx="${cx}" cy="${cy-R*0.7}" rx="${R*0.6}" ry="${R*0.18}" fill="rgba(220,240,255,0.5)"/>`;
    surfacePaths+=`<ellipse cx="${cx}" cy="${cy+R*0.7}" rx="${R*0.55}" ry="${R*0.15}" fill="rgba(220,240,255,0.45)"/>`;
  } else if(w.planetType==='volcanic'){
    // Lava flows
    for(let i=0;i<6;i++){
      const a=(seed*23+i*61)%360*Math.PI/180;
      const r2=R*0.2+((seed+i*17)%40)/100*R*0.5;
      const lx=cx+Math.cos(a)*r2,ly=cy+Math.sin(a)*r2;
      surfacePaths+=`<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${2+((seed+i)%4)}" fill="#ff4400" opacity="${0.4+((seed+i)%4)/10}"/>`;
    }
    // Glow
    surfacePaths+=`<circle cx="${cx}" cy="${cy}" r="${R*0.8}" fill="none" stroke="rgba(255,80,0,0.15)" stroke-width="4"/>`;
  } else if(w.planetType==='swamp'){
    // Dense vegetation patches
    for(let i=0;i<8;i++){
      const a=(seed*19+i*43)%360*Math.PI/180;
      const r2=R*0.15+((seed+i*11)%50)/100*R*0.55;
      const vx=cx+Math.cos(a)*r2,vy=cy+Math.sin(a)*r2;
      surfacePaths+=`<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="${4+((seed+i)%5)}" fill="#4a8a3a" opacity="0.45"/>`;
    }
    // Thick atmosphere haze
    surfacePaths+=`<ellipse cx="${cx}" cy="${cy-R*0.3}" rx="${R*0.7}" ry="${R*0.2}" fill="rgba(180,200,150,0.15)"/>`;
  } else if(w.planetType==='moon'){
    // Parent planet in background
    surfacePaths+=`<circle cx="${cx+R*1.1}" cy="${cy-R*0.6}" r="${R*0.8}" fill="rgba(120,100,80,0.15)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    // Craters
    for(let i=0;i<5;i++){
      const a=(seed*29+i*71)%360*Math.PI/180;
      const r2=R*0.2+((seed+i*13)%40)/100*R*0.4;
      const mx=cx+Math.cos(a)*r2,my=cy+Math.sin(a)*r2;
      surfacePaths+=`<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${3+((seed+i)%4)}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
    }
  } else {
    // Rock: continents
    const seaOp=p.seaLevel/180;
    surfacePaths+=`<ellipse cx="${cx-R*0.15}" cy="${cy+R*0.05}" rx="${R*0.35}" ry="${R*0.28}" fill="rgba(40,120,200,${seaOp})"/>`;
    surfacePaths+=`<ellipse cx="${cx+R*0.2}" cy="${cy-R*0.15}" rx="${R*0.25}" ry="${R*0.2}" fill="rgba(40,120,200,${seaOp*0.7})"/>`;
    // Continents
    surfacePaths+=`<ellipse cx="${cx+R*0.25}" cy="${cy+R*0.2}" rx="${R*0.2}" ry="${R*0.18}" fill="${colors[1]}" opacity="0.5"/>`;
    surfacePaths+=`<ellipse cx="${cx-R*0.3}" cy="${cy-R*0.25}" rx="${R*0.22}" ry="${R*0.15}" fill="${colors[2]}" opacity="0.4"/>`;
  }

  // Volcanism overlay
  if(p.tectonicActivity>50){
    const vo=Math.min(1,(p.tectonicActivity-50)/50);
    for(let i=0;i<3;i++){
      const a=(seed*31+i*83)%360*Math.PI/180;
      const r2=R*0.3+((seed+i)%20)/100*R*0.3;
      surfacePaths+=`<circle cx="${(cx+Math.cos(a)*r2).toFixed(1)}" cy="${(cy+Math.sin(a)*r2).toFixed(1)}" r="${2+i}" fill="rgba(255,80,20,${vo*0.6})" />`;
    }
  }

  // Life indicators
  let lifeRing='';
  if(w.flags.firstLifeBorn){
    lifeRing=`<circle cx="${cx}" cy="${cy}" r="${R+12}" fill="none" stroke="#44ff88" stroke-width="1.5" stroke-dasharray="5,5" opacity="0.5"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="60s" repeatCount="indefinite"/></circle>`;
  }
  let civGlow='';
  if(w.flags.civilizationUnlocked){
    civGlow=`<circle cx="${cx}" cy="${cy}" r="${R+16}" fill="none" stroke="#ffdd44" stroke-width="1" stroke-dasharray="3,7" opacity="0.4"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="-360 ${cx} ${cy}" dur="90s" repeatCount="indefinite"/></circle>`;
  }

  // City lights for civilization
  let civLights='';
  if(sIdx>=21){
    const intensity=Math.min(12,Math.floor((sIdx-20)*2));
    for(let i=0;i<intensity;i++){
      const a=((seed*7+i*47)%360)*Math.PI/180;
      const r2=R*0.3+((seed+i*19)%40)/100*R*0.4;
      const lx=cx+Math.cos(a)*r2,ly=cy+Math.sin(a)*r2;
      civLights+=`<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" fill="#ffe066" opacity="${0.3+((seed+i)%5)/10}"><animate attributeName="opacity" values="${0.3+((seed+i)%5)/10};${0.6+((seed+i)%3)/10};${0.3+((seed+i)%5)/10}" dur="${2+i%3}s" repeatCount="indefinite"/></circle>`;
    }
  }

  // Atmosphere
  const atmoOp=clamp(p.atmosphericStability/200,0.05,0.3);

  // Orbital ring for space stage
  let spaceRing='';
  if(sIdx>=29){
    spaceRing=`<ellipse cx="${cx}" cy="${cy}" rx="${R+24}" ry="${R*0.25+6}" fill="none" stroke="rgba(255,220,100,0.3)" stroke-width="1.5" stroke-dasharray="4,8" transform="rotate(-20 ${cx} ${cy})"><animateTransform attributeName="transform" type="rotate" from="-20 ${cx} ${cy}" to="340 ${cx} ${cy}" dur="120s" repeatCount="indefinite"/></ellipse>`;
    // Satellite dots
    for(let i=0;i<3;i++){
      const a=((i*120+seed*5)%360)*Math.PI/180;
      const sx=cx+Math.cos(a)*(R+24),sy=cy+Math.sin(a)*(R*0.25+6);
      spaceRing+=`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2" fill="#ffee88" opacity="0.7"/>`;
    }
  }

  // Star background dots
  let starDots='';
  for(let i=0;i<20;i++){
    const sx=(seed*13+i*37)%S, sy=(seed*7+i*53)%S;
    const sr=0.5+((seed+i)%3)*0.4;
    starDots+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="white" opacity="${0.15+((seed+i)%4)*0.08}"/>`;
  }

  const stageObj=getStageObj(sIdx);

  return `<svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" class="world-glyph">
    <defs>
      <radialGradient id="sg12"><stop offset="0%" stop-color="${sc[0]}" stop-opacity="0.25"/><stop offset="100%" stop-color="${sc[0]}" stop-opacity="0"/></radialGradient>
      <radialGradient id="pg12"><stop offset="0%" stop-color="${colors[1]}"/><stop offset="50%" stop-color="${colors[0]}" stop-opacity="0.9"/><stop offset="100%" stop-color="#0a0a15"/></radialGradient>
      <radialGradient id="hl12" cx="35%" cy="35%"><stop offset="0%" stop-color="rgba(255,255,255,0.15)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
      <clipPath id="pc12"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
      <filter id="glow12"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- Stars -->
    ${starDots}
    <!-- Star glow -->
    <circle cx="${cx}" cy="${cy}" r="${R*2.2}" fill="url(#sg12)"/>
    <!-- Planet shadow -->
    <circle cx="${cx+3}" cy="${cy+3}" r="${R}" fill="rgba(0,0,0,0.4)"/>
    <!-- Planet body -->
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#pg12)"/>
    <g clip-path="url(#pc12)">
      ${surfacePaths}
      ${civLights}
    </g>
    <!-- Highlight -->
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#hl12)"/>
    <!-- Atmosphere -->
    <circle cx="${cx}" cy="${cy}" r="${R+2}" fill="none" stroke="rgba(150,200,255,${atmoOp})" stroke-width="4"/>
    <circle cx="${cx}" cy="${cy}" r="${R+5}" fill="none" stroke="rgba(150,200,255,${atmoOp*0.4})" stroke-width="2"/>
    ${lifeRing}
    ${civGlow}
    ${spaceRing}
    <!-- Stage label -->
    <text x="${cx}" y="${S-14}" text-anchor="middle" fill="var(--muted)" font-size="12" font-weight="600">${stageObj.icon} ${stageObj.name}</text>
  </svg>`;
}

// Achievement illustration SVG
function renderAchIllustration(def){
  const W=460, H=180;
  const colors={common:['#6bc2ff','#67efd8'],rare:['#60a5fa','#a78bfa'],epic:['#c084fc','#f472b6']}[def.rarity]||['#6bc2ff','#67efd8'];
  const seed=def.id.length*7+def.id.charCodeAt(2);
  let bg='';
  for(let i=0;i<15;i++){
    const x=(seed*13+i*31)%W,y=(seed*7+i*43)%H;
    bg+=`<circle cx="${x}" cy="${y}" r="${0.5+((seed+i)%3)*0.5}" fill="white" opacity="${0.1+((seed+i)%4)*0.05}"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ag_${seed}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.15"/><stop offset="100%" stop-color="${colors[1]}" stop-opacity="0.08"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#ag_${seed})" rx="16"/>
    ${bg}
    <text x="${W/2}" y="${H/2+8}" text-anchor="middle" font-size="52" opacity="0.7">${def.icon}</text>
    <text x="${W/2}" y="${H-20}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="11" font-weight="600">${escapeHtml(def.name)}</text>
  </svg>`;
}

// ════════════════════════════════════════
// 创建 / 重置
// ════════════════════════════════════════
function createWorldFromSetup(){
  const pt=document.querySelector('input[name="planetType"]:checked')?.value||'rock';
  const ss=document.querySelector('input[name="starSystem"]:checked')?.value||'sun_like';
  const lb=document.querySelector('input[name="lifeBias"]:checked')?.value||'carbon';
  const dur=parseInt(document.querySelector('input[name="obsDuration"]:checked')?.value||'45',10);
  state.world=createWorld(pt,ss,lb,dur);
  state.setupNotice="";
  state.world.currentReport={
    type:"intro",title:"📡 观测档案建立完成",
    text:`你已成为高维空间文明观测员。\n\n当前样本：${PLANET_TYPES[pt].name} · ${STAR_SYSTEMS[ss].name} · ${LIFE_BIASES[lb].name}\n单次观测周期：${formatDurationMinutes(dur)}\n\n现在可以在主控台开始记录学习/工作时间。观测尚未开始，星球被冻结在初始参考帧中。\n点击"开始观测"后，时间才会开始流逝。`,
    meta:`${PLANET_TYPES[pt].name}`,icon:"📡"
  };
  state.recentLogs.unshift({title:"建立观测档案",text:`${PLANET_TYPES[pt].name} · ${STAR_SYSTEMS[ss].name}`,at:Date.now()});
  saveState();
  activeView="report";
  render();
}

function resetCurrentWorld(notice){
  if(state.world&&state.world.isObserving) pauseObservation();
  state.world=null;
  state.setupNotice=notice||"请重新选择观测对象。";
  saveState();
  activeView="setup";
  render();
}

function clearAllData(){
  state=getDefaultState();
  localStorage.removeItem(STORAGE_KEY);
  activeView="setup";
  render();
}

// ════════════════════════════════════════
// 渲染
// ════════════════════════════════════════
function showView(name){
  if(name==="main") activeView=state.world?(state.world.alive?"main":"report"):"setup";
  else if(name==="report") activeView=state.world?"report":"setup";
  else if(name==="achievements") activeView=state.world?"achievements":"setup";
  else if(name==="settings") activeView="settings";
  else activeView="setup";
  render();
}

function render(){
  document.body.dataset.theme=state.theme;
  renderTopStats();
  renderSetup();
  renderMain();
  renderReport();
  renderAchievements();
  renderSettings();
  for(const id of ["setupView","mainView","reportView","settingsView","achievementsView"]){
    const el=document.getElementById(id);
    if(el) el.classList.toggle("hidden",id!==activeView+"View");
  }
  document.querySelectorAll(".nav-button").forEach(b=>{
    b.classList.toggle("nav-active",b.dataset.nav===activeView);
  });
}

function renderTopStats(){
  const now=new Date();
  document.getElementById("nowTime").textContent=now.toLocaleString("zh-CN");
  const totalMs=state.lifetimeMs+(state.world&&state.world.isObserving?getRunningDeltaMs():0);
  document.getElementById("lifetimeHours").textContent=(totalMs/3600000).toFixed(2)+" 小时";
  const wMs=state.world?(state.world.totalObservedMs+(state.world.isObserving?getRunningDeltaMs():0)):0;
  document.getElementById("worldHours").textContent=(wMs/3600000).toFixed(2)+" 小时";
}

function renderSetup(){
  const notice=document.getElementById("setupNotice");
  if(notice){
    notice.classList.toggle("hidden",!state.setupNotice);
    notice.textContent=state.setupNotice||"";
  }
}

function renderMain(){
  const w=state.world;
  if(!w) return;
  const badge=document.getElementById("statusBadge");
  if(!w.alive) badge.textContent="样本灭绝";
  else if(!w.hasStartedObservation) badge.textContent="尚未开始";
  else if(w.cycleState.cycleCompleted) badge.textContent="可结算";
  else if(w.isObserving) badge.textContent="观测中";
  else badge.textContent="已暂停";

  // v1.2: Observation info bar
  document.getElementById("obsStartDate").textContent=w.observationStartedYearText||"尚未开始";
  const realTotal=w.totalObservedMs+(w.isObserving?getRunningDeltaMs():0);
  document.getElementById("obsRealTotal").textContent=formatHours(realTotal);
  document.getElementById("obsCycleTarget").textContent=formatDurationMinutes(w.observationConfig.selectedDurationMinutes);

  // Cycle status
  const cycleElapsed=getCycleElapsedMs(w);
  const cycleTarget=w.observationConfig.cycleTargetMs;
  let cycleStatusText="";
  const panel=document.getElementById("cycleStatusPanel");

  if(!w.hasStartedObservation){
    cycleStatusText="观测尚未开始，这颗星球仍被冻结在初始参考帧中。";
    document.getElementById("obsCycleStatus").textContent="未开始";
  } else if(w.cycleState.cycleCompleted||cycleElapsed>=cycleTarget){
    cycleStatusText="本轮观测窗口已完成。返回观测站后，可读取新的世界变化。";
    panel.classList.add("cycle-ready");
    document.getElementById("obsCycleStatus").textContent="✅ 可结算";
  } else if(w.isObserving){
    cycleStatusText=`本轮观测正在进行中，已流逝 ${formatHours(cycleElapsed)} / 目标 ${formatDurationMinutes(w.observationConfig.selectedDurationMinutes)}`;
    panel.classList.remove("cycle-ready");
    document.getElementById("obsCycleStatus").textContent="观测中";
  } else {
    cycleStatusText=`观测已暂停。本轮已流逝 ${formatHours(cycleElapsed)} / 目标 ${formatDurationMinutes(w.observationConfig.selectedDurationMinutes)}`;
    panel.classList.remove("cycle-ready");
    document.getElementById("obsCycleStatus").textContent="已暂停";
  }

  document.getElementById("cycleStatusText").textContent=cycleStatusText;
  const cyclePct=w.hasStartedObservation?clamp(cycleElapsed/cycleTarget*100,0,100):0;
  document.getElementById("cycleProgressBar").style.width=cyclePct+"%";

  // Timer
  const runDelta=w.isObserving?getRunningDeltaMs():0;
  // Show cycle elapsed as main timer
  document.getElementById("sessionTimer").textContent=formatClock(cycleElapsed/1000);
  document.getElementById("timerHint").textContent=
    !w.hasStartedObservation?"观测尚未开始，这颗星球仍被冻结在初始参考帧中。":
    w.cycleState.cycleCompleted?"本轮观测窗口已完成，请前往观测站结算。":
    w.isObserving?"在线观测中，时间正在流逝……":
    "观测已暂停，时间停止累计。";

  // Pending
  document.getElementById("pendingHours").textContent=w.cycleState.cycleCompleted?"可结算":formatHours(cycleElapsed);

  // Stage
  const stageObj=getStageObj(w.currentStage);
  document.getElementById("stageName").textContent=stageObj.icon+" "+stageObj.name;
  document.getElementById("stageDescription").textContent=stageObj.desc;
  const next=STAGES.find(s=>s.id===w.currentStage+1);
  const totalH=(w.totalObservedMs+runDelta)/3600000;
  let pct=100;
  if(next){
    const range=next.minHours-(stageObj.minHours||0);
    const cur=totalH-(stageObj.minHours||0);
    pct=range>0?clamp(cur/range*100,0,100):100;
  }
  document.getElementById("stageProgressBar").style.width=pct+"%";
  document.getElementById("stageProgressText").textContent=
    next?`距下一阶段最低时长还需 ${formatHours(Math.max(0,(next.minHours-totalH)*3600000))}（概率推进，不保证到时即进）`:"已达最终阶段。";

  // Profile
  document.getElementById("planetValue").textContent=PLANET_TYPES[w.planetType]?.name||w.planetType;
  document.getElementById("starValue").textContent=STAR_SYSTEMS[w.starSystemType]?.name||w.starSystemType;
  document.getElementById("biasValue").textContent=LIFE_BIASES[w.lifeBias]?.name||w.lifeBias;
  document.getElementById("observerSince").textContent=formatDateTime(state.observerSince);
  document.getElementById("aliveState").textContent=w.alive?"观测中":"已毁灭";

  // v1.2: Year label above glyph
  document.getElementById("obsYearLabel").textContent=w.observationStartedAt?`观测开始：${w.observationStartedYearText} · 已累计 ${formatHours(realTotal)}`:"观测开始：尚未开始";

  // Parameters
  renderParamsPanel(w);

  // SVG (larger)
  document.getElementById("worldGlyphContainer").innerHTML=renderWorldGlyph(w, 360);

  // Buttons
  document.getElementById("startButton").disabled=!w.alive||w.isObserving||(w.currentReport&&w.currentReport.type==="choice");
  document.getElementById("pauseButton").disabled=!w.alive||!w.isObserving;

  // v1.2: Achievement quick view
  const achCount=w.achievements?w.achievements.unlocked.length:0;
  document.getElementById("achCountBadge").textContent=`${achCount} / ${ACHIEVEMENT_DEFS.length}`;
  const achList=document.getElementById("achRecentList");
  if(achList){
    const recent=(w.achievements?.unlocked||[]).slice(-3).reverse();
    if(recent.length===0){
      achList.innerHTML='<div class="subtle" style="padding:8px;font-size:0.85rem;">暂无成就，继续观测吧。</div>';
    } else {
      achList.innerHTML=recent.map(r=>{
        const def=ACHIEVEMENT_DEFS.find(d=>d.id===r.id);
        if(!def) return '';
        return `<div class="achievement-entry" onclick="openAchModal('${def.id}')"><div class="ach-icon">${def.icon}</div><div class="ach-info"><h4>${escapeHtml(def.name)}</h4><p>${escapeHtml(def.description).slice(0,30)}…</p></div><span class="ach-rarity ${def.rarity}">${{common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]}</span></div>`;
      }).join('');
    }
  }

  // Recent logs
  const logEl=document.getElementById("recentLog");
  if(logEl){
    logEl.innerHTML=state.recentLogs.slice(0,5).map(l=>
      `<div class="log-item"><strong>${escapeHtml(l.title)}</strong><div class="subtle">${escapeHtml(l.text).slice(0,100)}…</div><small>${formatDateTime(l.at)}</small></div>`
    ).join("")||'<div class="log-item">暂无历史记录。</div>';
  }

  // Life window
  const lwEl=document.getElementById("lifeWindowStatus");
  if(lwEl){
    if(w.flags.firstLifeBorn) lwEl.textContent="✅ 生命已诞生";
    else if(isHighQualityLifeWindow(w.parameters)) lwEl.textContent="🟢 高质量生命窗口开启";
    else if(isLifeWindowOpen(w.parameters)) lwEl.textContent="🟡 生命窗口开启";
    else lwEl.textContent="🔴 生命窗口未开启";
  }
}

function renderParamsPanel(w){
  const container=document.getElementById("paramsPanel");
  if(!container) return;
  const p=w.parameters;
  const items=[
    {label:"气压",val:`${p.atmospherePressure.toFixed(1)} atm`,pct:p.atmospherePressure/4*100},
    {label:"温度",val:`${p.averageTemperature.toFixed(0)}℃`,pct:(p.averageTemperature+50)/250*100},
    {label:"海平面",val:`${p.seaLevel.toFixed(0)}%`,pct:p.seaLevel},
    {label:"可用水量",val:p.waterAvailability.toFixed(0),pct:p.waterAvailability},
    {label:"氧含量",val:`${p.oxygenLevel.toFixed(1)}%`,pct:p.oxygenLevel/40*100},
    {label:"辐射",val:p.radiationLevel.toFixed(0),pct:p.radiationLevel,danger:p.radiationLevel>60},
    {label:"地质活跃",val:p.tectonicActivity.toFixed(0),pct:p.tectonicActivity},
    {label:"大气稳定",val:p.atmosphericStability.toFixed(0),pct:p.atmosphericStability},
    {label:"养分指数",val:p.nutrientIndex.toFixed(0),pct:p.nutrientIndex},
    {label:"生物迹象",val:p.biosignatureLevel.toFixed(0),pct:p.biosignatureLevel}
  ];
  container.innerHTML=items.map(i=>
    `<div class="param-item"><div class="param-head"><span>${i.label}</span><strong>${i.val}</strong></div><div class="param-bar"><span style="width:${clamp(i.pct,0,100)}%;${i.danger?'background:var(--danger)':''}"></span></div></div>`
  ).join("");

  const civContainer=document.getElementById("civParamsPanel");
  if(!civContainer) return;
  if(w.currentStage<15){
    civContainer.innerHTML='<div class="subtle" style="padding:10px;">文明参数将在智慧生命出现后解锁。</div>';
    return;
  }
  const c=w.civilization;
  const civItems=[
    {label:"人口规模",val:c.populationScale.toFixed(0),pct:c.populationScale},
    {label:"社会复杂度",val:c.socialComplexity.toFixed(0),pct:c.socialComplexity},
    {label:"知识积累",val:c.knowledgeLevel.toFixed(0),pct:c.knowledgeLevel},
    {label:"技术水平",val:c.technologyLevel.toFixed(0),pct:c.technologyLevel},
    {label:"文化凝聚",val:c.culturalCohesion.toFixed(0),pct:c.culturalCohesion},
    {label:"政治稳定",val:c.politicalStability.toFixed(0),pct:c.politicalStability},
    {label:"资源压力",val:c.resourcePressure.toFixed(0),pct:c.resourcePressure,danger:c.resourcePressure>60},
    {label:"生态平衡",val:c.ecologicalBalance.toFixed(0),pct:c.ecologicalBalance},
    {label:"探索驱力",val:c.explorationDrive.toFixed(0),pct:c.explorationDrive},
    {label:"战争紧张",val:c.warTension.toFixed(0),pct:c.warTension,danger:c.warTension>50},
    {label:"思想深度",val:c.spiritualDepth.toFixed(0),pct:c.spiritualDepth},
    {label:"自动化",val:c.automationLevel.toFixed(0),pct:c.automationLevel},
    {label:"太空能力",val:c.spaceCapability.toFixed(0),pct:c.spaceCapability},
    {label:"文明信号",val:c.civilizationSignal.toFixed(0),pct:c.civilizationSignal}
  ];
  civContainer.innerHTML=civItems.map(i=>
    `<div class="param-item"><div class="param-head"><span>${i.label}</span><strong>${i.val}</strong></div><div class="param-bar"><span style="width:${clamp(i.pct,0,100)}%;${i.danger?'background:var(--danger)':''}"></span></div></div>`
  ).join("");
}

function renderReport(){
  const w=state.world;
  const titleEl=document.getElementById("reportTitle");
  const textEl=document.getElementById("reportText");
  const metaEl=document.getElementById("reportMeta");
  const iconEl=document.getElementById("reportIcon");
  const optionsEl=document.getElementById("reportOptions");
  const contBtn=document.getElementById("reportContinueButton");
  const restartBtn=document.getElementById("reportRestartButton");
  const badgeEl=document.getElementById("reportTypeBadge");
  const achSection=document.getElementById("reportAchievements");
  const achListEl=document.getElementById("reportAchList");

  optionsEl.innerHTML="";
  achSection.classList.add("hidden");

  if(!w){
    titleEl.textContent="尚未建立观测档案";
    textEl.textContent="请先建立观测档案。";
    metaEl.textContent="";
    iconEl.textContent="📡";
    badgeEl.textContent="未建档";
    contBtn.textContent="前往建档";
    contBtn.disabled=false;
    restartBtn.classList.add("hidden");
    return;
  }

  const report=w.currentReport||{type:"idle",title:"🔭 暂无新简报",text:"开始观测后再返回查看。",meta:"待机",icon:"🔭"};
  titleEl.textContent=report.title||"";
  textEl.textContent=report.text||"";
  metaEl.textContent=report.meta||"";
  iconEl.textContent=report.icon||"🔭";

  const badges={intro:"初始化",idle:"待命",brief:"普通简报",choice:"关键抉择",result:"分支结果",stage_advance:"阶段跃迁"};
  badgeEl.textContent=badges[report.type]||"简报";

  const glyphEl=document.getElementById("reportGlyph");
  if(glyphEl) glyphEl.innerHTML=renderWorldGlyph(w,200);

  // v1.2: Show newly unlocked achievements in report
  const newAchIds=w.achievements?.newlyUnlockedThisRound||[];
  if(newAchIds.length>0){
    achSection.classList.remove("hidden");
    achListEl.innerHTML=newAchIds.map(id=>{
      const def=ACHIEVEMENT_DEFS.find(d=>d.id===id);
      if(!def) return '';
      return `<div class="achievement-entry" onclick="openAchModal('${def.id}')" style="margin-bottom:6px;"><div class="ach-icon">${def.icon}</div><div class="ach-info"><h4>${escapeHtml(def.name)}</h4><p>${escapeHtml(def.description).slice(0,40)}…</p></div><span class="ach-rarity ${def.rarity}">${{common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]}</span></div>`;
    }).join('');
  }

  if(report.type==="choice"&&report.options){
    report.options.forEach((opt,i)=>{
      const btn=document.createElement("button");
      btn.className="option-btn";
      btn.textContent=opt.label;
      btn.addEventListener("click",()=>resolveChoice(i));
      optionsEl.appendChild(btn);
    });
    contBtn.textContent="请先完成选择";
    contBtn.disabled=true;
  } else {
    contBtn.textContent=w.alive?"返回主控台":"前往重新建档";
    contBtn.disabled=false;
  }
  restartBtn.classList.toggle("hidden",w.alive);
}

function renderAchievements(){
  const w=state.world;
  const wall=document.getElementById("achievementWall");
  const countEl=document.getElementById("achWallCount");
  if(!wall) return;
  if(!w){
    wall.innerHTML='<div class="subtle" style="padding:20px;">请先建立观测档案。</div>';
    countEl.textContent="0 / 0";
    return;
  }

  const unlocked=w.achievements?w.achievements.unlocked.map(a=>a.id):[];
  countEl.textContent=`${unlocked.length} / ${ACHIEVEMENT_DEFS.length}`;

  wall.innerHTML=ACHIEVEMENT_DEFS.map(def=>{
    const isUnlocked=unlocked.includes(def.id);
    const hidden=def.hiddenUntilUnlock&&!isUnlocked;
    if(hidden){
      return `<div class="achievement-entry locked"><div class="ach-icon locked-icon">❓</div><div class="ach-info"><h4>？？？</h4><p>尚未解锁的隐藏成就</p></div><span class="ach-rarity ${def.rarity}">${{common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]}</span></div>`;
    }
    if(!isUnlocked){
      return `<div class="achievement-entry locked"><div class="ach-icon locked-icon">${def.icon}</div><div class="ach-info"><h4>${escapeHtml(def.name)}</h4><p style="opacity:0.5;">${escapeHtml(def.conditionText)}</p></div><span class="ach-rarity ${def.rarity}">${{common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]}</span></div>`;
    }
    return `<div class="achievement-entry" onclick="openAchModal('${def.id}')"><div class="ach-icon">${def.icon}</div><div class="ach-info"><h4>${escapeHtml(def.name)}</h4><p>${escapeHtml(def.description).slice(0,35)}…</p></div><span class="ach-rarity ${def.rarity}">${{common:'普通',rare:'稀有',epic:'史诗'}[def.rarity]}</span></div>`;
  }).join('');
}

function renderSettings(){
  const el=document.getElementById("themeLabel");
  if(el) el.textContent=state.theme==="aurora"?"当前主题：极光观测站":"当前主题：深空观测站";
  // Set duration select
  const sel=document.getElementById("changeDurationSelect");
  if(sel&&state.world){
    sel.value=String(state.world.observationConfig.selectedDurationMinutes);
  }
}

// ════════════════════════════════════════
// Achievement Modal
// ════════════════════════════════════════
function openAchModal(id){
  const def=ACHIEVEMENT_DEFS.find(d=>d.id===id);
  if(!def) return;
  const w=state.world;
  const record=w?.achievements?.unlocked.find(a=>a.id===id);

  document.getElementById("achModalTitle").textContent=def.icon+" "+def.name;
  document.getElementById("achModalIllust").innerHTML=renderAchIllustration(def);
  document.getElementById("achModalDesc").textContent=def.description;

  const rarityLabels={common:'普通',rare:'稀有',epic:'史诗'};
  const catLabels={universal:'通用推进',rare_event:'稀有事件',choice:'抉择分支',planet_special:'行星专属',branch_ending:'分歧结局'};
  document.getElementById("achModalMeta").innerHTML=`
    <span class="ach-rarity ${def.rarity}">${rarityLabels[def.rarity]||''}</span>
    <span class="badge">${catLabels[def.category]||''}</span>
    ${record?`<span class="badge">解锁于 ${formatDateTime(record.unlockedAt)}</span>`:'<span class="badge">未解锁</span>'}
  `;
  document.getElementById("achModalCondition").textContent="解锁条件："+def.conditionText;
  document.getElementById("achModal").classList.remove("hidden");
}

function closeAchModal(e){
  if(e&&e.target!==document.getElementById("achModal")) return;
  document.getElementById("achModal").classList.add("hidden");
}
// Make it globally accessible
window.openAchModal=openAchModal;
window.closeAchModal=closeAchModal;
window.showView=showView;

// ════════════════════════════════════════
// 事件绑定
// ════════════════════════════════════════
function bindEvents(){
  document.querySelectorAll(".nav-button").forEach(b=>{
    b.addEventListener("click",()=>showView(b.dataset.nav));
  });
  document.getElementById("createWorldButton")?.addEventListener("click",createWorldFromSetup);
  document.getElementById("startButton")?.addEventListener("click",startObservation);
  document.getElementById("pauseButton")?.addEventListener("click",pauseObservation);
  document.getElementById("stationButton")?.addEventListener("click",generateStationReport);

  document.getElementById("reportContinueButton")?.addEventListener("click",()=>{
    if(!state.world){activeView="setup";render();return;}
    if(state.world.currentReport?.type==="choice") return;
    // Clear newly unlocked
    if(state.world.achievements) state.world.achievements.newlyUnlockedThisRound=[];
    activeView=state.world.alive?"main":"setup";
    saveState();
    render();
  });
  document.getElementById("reportRestartButton")?.addEventListener("click",()=>{
    resetCurrentWorld("上一颗样本已毁灭，请重新选择观测对象。");
  });
  document.getElementById("themeToggleButton")?.addEventListener("click",()=>{
    state.theme=state.theme==="nebula"?"aurora":"nebula";
    saveState();render();
  });
  document.getElementById("changeDurationButton")?.addEventListener("click",()=>{
    const w=state.world;
    if(!w) return;
    const val=parseInt(document.getElementById("changeDurationSelect").value,10);
    w.observationConfig.selectedDurationMinutes=val;
    w.observationConfig.cycleTargetMs=val*60000;
    saveState();render();
  });
  document.getElementById("resetWorldButton")?.addEventListener("click",()=>{
    if(confirm("重新选择星球会清空当前星球进度，但保留累计总观测时长。确认继续吗？"))
      resetCurrentWorld("你已主动更换观测对象，累计总时长已保留。");
  });
  document.getElementById("clearAllButton")?.addEventListener("click",()=>{
    if(confirm("这会清空全部本地数据。确认继续吗？")) clearAllData();
  });

  window.addEventListener("pagehide",persistOnExit);
  window.addEventListener("beforeunload",persistOnExit);
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="hidden") persistOnExit();
    if(document.visibilityState==="visible") syncOfflineTime();
  });

  // Close modal on Escape
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") document.getElementById("achModal")?.classList.add("hidden");
  });
}

function init(){
  syncOfflineTime();
  bindEvents();
  if(!state.world) activeView="setup";
  else if(!state.world.alive) activeView="report";
  else activeView="main";

  // Migrate v1.1 data to v1.2
  if(state.world&&!state.world.observationConfig){
    state.world.observationConfig={selectedDurationMinutes:45,cycleTargetMs:2700000};
    state.world.cycleState={cycleStartedAt:null,cyclePausedAt:null,cycleAccumulatedMs:0,cycleCompleted:false};
    state.world.observationStartedAt=state.world.observationStartAt||state.world.createdAt;
    state.world.observationStartedYearText=formatDateShort(state.world.observationStartedAt);
    if(!state.world.achievements) state.world.achievements={unlocked:[],seenAchievementIds:[],newlyUnlockedThisRound:[]};
    saveState();
  }

  render();
  setInterval(()=>{
    renderTopStats();
    if(activeView==="main") renderMain();
  },1000);
}

window.addEventListener("DOMContentLoaded",init);
