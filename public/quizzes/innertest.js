QuizRegistry.register({
    categoryId: 'personality',
    categoryName: '性格测试',
    categoryEmoji: '🎭',

    quizId: 'innertest',
    quizName: '测测你的真正内心',
    quizEmoji: '🔮',
    quizDesc: '10种人格 · 20题',
    resultMode: 'dimension',

    quizData: [
        {
            id: 1,
            question: `周末早上醒来，你的第一反应是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `再睡五分钟……或者一上午`, scores: { X: 2, F: 1 } },
                { text: `精神抖擞，早起锻炼或打扮`, scores: { S: 2, Y: 1 } },
                { text: `立刻拿起手机刷短视频/看游戏动态`, scores: { F: 2, Z: 1 } },
                { text: `抱着玩偶发呆，脑补小剧场`, scores: { L: 2, W: 1 } }
            ]
        },
        {
            id: 2,
            question: `去奶茶店，你会怎么点？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `全糖加波霸加奶盖，要甜甜的！`, scores: { L: 2, S: 1 } },
                { text: `冰美式，不加糖，成年人不需要甜`, scores: { Y: 2, P: 1 } },
                { text: `哪个打折买哪个，或者直接买瓶矿泉水`, scores: { C: 2, X: 1 } },
                { text: `随便，你们喝什么我喝什么`, scores: { X: 2, F: -1 } }
            ]
        },
        {
            id: 3,
            question: `遇到极其讨厌的人找你说话，你会？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `表面笑嘻嘻，心里已经把他千刀万剐`, scores: { B: 2, Y: 1 } },
                { text: `直接翻白眼或者装没听见`, scores: { P: 2, Y: 1 } },
                { text: `热情地和他扯东扯西，其实是在逗他玩`, scores: { B: 2, S: 1 } },
                { text: `表现出呆呆的样子，让他觉得无趣自己走开`, scores: { L: 2, X: 1 } }
            ]
        },
        {
            id: 4,
            question: `你最喜欢的环境氛围是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `阳光明媚的草地，越热闹越好`, scores: { S: 2, L: 1 } },
                { text: `拉上窗帘，只有电脑屏幕发光的暗室`, scores: { F: 2, Z: 1 } },
                { text: `下着小雨的下午，坐在窗边看书`, scores: { W: 2, Y: 1 } },
                { text: `充满高级感、安静且有格调的空间`, scores: { Y: 2, C: 1 } }
            ]
        },
        {
            id: 5,
            question: `如果突然停电了，你的第一反应是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `呜呜呜好黑，谁来陪陪我！`, scores: { L: 2, S: -1 } },
                { text: `哼，终于轮到我黑暗力量觉醒的时候了。`, scores: { Z: 2, B: 1 } },
                { text: `太好了，不用干活/学习了，睡觉！`, scores: { X: 2, F: 1 } },
                { text: `烦死了！我的游戏/剧还没存档！`, scores: { P: 2, F: 1 } }
            ]
        },
        {
            id: 6,
            question: `你的手机壳通常是什么样的？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `带有可爱卡通图案或毛绒绒的`, scores: { L: 2, F: 1 } },
                { text: `极简纯色，或者高级皮革质感`, scores: { Y: 2, C: 1 } },
                { text: `搞笑表情包或沙雕文案`, scores: { P: 2, S: 1 } },
                { text: `能当支架、能当充电宝等多功能实用款`, scores: { C: 2, X: 1 } }
            ]
        },
        {
            id: 7,
            question: `逛街看到一个非常可爱但完全没用的东西，你会？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `没用又怎样？可爱就够了！买！`, scores: { L: 2, C: -2 } },
                { text: `拍个照发朋友圈，绝对不花冤枉钱`, scores: { S: 2, W: 1 } },
                { text: `拿起来看看标价，心里暗骂一句"抢钱啊"，放下`, scores: { C: 2, X: 1 } },
                { text: `这种东西只有蠢货才会买`, scores: { Y: 2, P: 1 } }
            ]
        },
        {
            id: 8,
            question: `对于"缘分"这个词，你怎么看？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `命中注定的相遇一定存在！`, scores: { L: 2, Z: 1 } },
                { text: `都是概率学问题，别搞玄学`, scores: { Y: 2, B: 1 } },
                { text: `缘分能不能变现？`, scores: { C: 2, F: -1 } },
                { text: `随遇而安吧，聚散都是常态`, scores: { W: 2, X: 1 } }
            ]
        },
        {
            id: 9,
            question: `理想的假期是怎么度过的？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `约上三五好友去网红地打卡`, scores: { S: 2, L: 1 } },
                { text: `一口零食一口快乐水，在家通宵打游戏`, scores: { F: 2, X: 1 } },
                { text: `去无人知晓的小众景点，感受孤独`, scores: { W: 2, Z: 1 } },
                { text: `搞个副业或者去实习，搞钱要紧`, scores: { C: 2, P: -1 } }
            ]
        },
        {
            id: 10,
            question: `被别人误解了，你会怎么做？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `眼泪汪汪地拼命解释`, scores: { L: 2, S: 1 } },
                { text: `懒得理，爱怎么想怎么想`, scores: { X: 2, Y: 1 } },
                { text: `当场怼回去，嗓门必须比他大`, scores: { P: 2, Z: 1 } },
                { text: `表面顺着他们，暗地里找机会让他们付出代价`, scores: { B: 2, W: -1 } }
            ]
        },
        {
            id: 11,
            question: `你的微信聊天风格是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `颜文字满天飞：QAQ、TAT、Orz`, scores: { L: 2, S: 1 } },
                { text: `哦、嗯、好的，能用一个字绝不说两个字`, scores: { Y: 2, P: 1 } },
                { text: `各种沙雕表情包，绝不打字`, scores: { F: 2, S: 1 } },
                { text: `阴阳怪气大师，说话拐弯抹角`, scores: { B: 2, W: 1 } }
            ]
        },
        {
            id: 12,
            question: `天上突然掉下500块钱在你面前，你会？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `哇！去买好吃的！`, scores: { L: 2, F: 1 } },
                { text: `环顾四周，这会不会是诈骗套路？`, scores: { B: 2, Y: 1 } },
                { text: `迅速装进兜里，只要我不说没人知道`, scores: { C: 2, X: 1 } },
                { text: `捡起来发朋友圈：今天运气真好~`, scores: { S: 2, W: 1 } }
            ]
        },
        {
            id: 13,
            question: `你发朋友圈/动态的频率是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `每天发，吃个饭也要拍九宫格`, scores: { S: 2, L: 1 } },
                { text: `几个月发一次，全是风景照或者不明所以的文案`, scores: { W: 2, B: 1 } },
                { text: `从不发，或者仅三天可见`, scores: { X: 2, Y: 1 } },
                { text: `只有转发抽奖链接的时候才活跃`, scores: { C: 2, F: 1 } }
            ]
        },
        {
            id: 14,
            question: `小组作业中，你通常扮演什么角色？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `啥也不会，但可以提供情绪价值的吉祥物`, scores: { L: 2, S: 1 } },
                { text: `默默把活全干了，懒得跟他们扯皮`, scores: { X: 2, F: 1 } },
                { text: `领导者，指挥他们干活，干不好就骂`, scores: { P: 2, Y: 1 } },
                { text: `摸鱼大师，最后挂名`, scores: { X: 2, C: 1 } }
            ]
        },
        {
            id: 15,
            question: `什么事情最容易让你瞬间破防？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `弄脏了刚买的新衣服/弄坏了喜欢的手办`, scores: { L: 2, F: 1 } },
                { text: `排队插队、走路玩手机挡路`, scores: { P: 2, Y: 1 } },
                { text: `损失了金钱，哪怕是一块钱`, scores: { C: 2, B: 1 } },
                { text: `别人不理解我内心深处的孤独`, scores: { W: 2, Z: 1 } }
            ]
        },
        {
            id: 16,
            question: `你对未来有什么规划？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `走一步看一步，开心就好`, scores: { X: 2, L: 1 } },
                { text: `必须财务自由，提前退休`, scores: { C: 2, Y: 1 } },
                { text: `这个世界终将被我统治`, scores: { Z: 2, B: 1 } },
                { text: `找个安静的地方，开个花店或者书店`, scores: { W: 2, S: -1 } }
            ]
        },
        {
            id: 17,
            question: `如果朋友告诉你一个惊天大八卦（关于别人的），你会？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `瞬间瞪大眼睛：真的吗！快说快说！`, scores: { L: 2, S: 1 } },
                { text: `哦，关我什么事，继续做自己的事`, scores: { X: 2, Y: 1 } },
                { text: `记在心里，以后当把柄用`, scores: { B: 2, C: 1 } },
                { text: `表现得毫无兴趣，转头就去告诉下一个人`, scores: { S: 2, P: 1 } }
            ]
        },
        {
            id: 18,
            question: `被蚊子咬了一个大包，你的反应是？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `好痒哦~谁来帮我吹吹~`, scores: { L: 2, S: -1 } },
                { text: `一巴掌拍死，顺便连墙一起锤`, scores: { P: 2, Z: 1 } },
                { text: `画个十字，忍忍就过去了`, scores: { X: 2, W: 1 } },
                { text: `它吸了我的血，我们的DNA已经融合了…`, scores: { Z: 2, F: 1 } }
            ]
        },
        {
            id: 19,
            question: `你最喜欢看什么类型的视频/电影？`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `甜宠剧、萌宠合集、搞笑综艺`, scores: { L: 2, S: 1 } },
                { text: `烧脑悬疑、高智商犯罪、科幻`, scores: { Y: 2, B: 1 } },
                { text: `热血战斗、机甲、超能力`, scores: { Z: 2, P: 1 } },
                { text: `治愈系纪录片、慢生活Vlog`, scores: { W: 2, X: 1 } }
            ]
        },
        {
            id: 20,
            question: `最后，选一个你最有眼缘的符号：`,
            scoringMode: `multi`,
            dimensions: [`L`, `Y`, `F`, `Z`, `X`, `B`, `S`, `W`, `P`, `C`],
            options: [
                { text: `☆ （闪亮亮的星星）`, scores: { L: 2, Z: 1 } },
                { text: `◆ （冰冷坚硬的钻石）`, scores: { Y: 2, C: 1 } },
                { text: `▼ （尖锐的倒三角）`, scores: { P: 2, B: 1 } },
                { text: `〇 （柔和的圆圈）`, scores: { X: 2, W: 1 } }
            ]
        }
    ],

    quizResults: [
        {
            dimension: `L`,
            level: `可爱萝莉`,
            subtitle: `外表可能是个糙汉/女汉子`,
            emoji: `🍓`,
            desc: `你的内心住着一个小公主/小王子。不管你平时在外面装得多高冷或多坚强，一旦回到家，你的智商就会退化到5岁。你喜欢毛茸茸的东西，遇到委屈容易掉眼泪，对这个世界充满了不切实际的粉色幻想。你其实很缺乏安全感，只想被无条件地宠爱。`
        },
        {
            dimension: `Y`,
            level: `孤傲御姐/霸总`,
            subtitle: `外表可能很随和软萌`,
            emoji: `🥀`,
            desc: `你骨子里极其理智甚至冷漠。你讨厌麻烦，讨厌无效社交，觉得大多数人都很蠢。你崇尚力量和独立，遇到问题第一反应是自己解决，绝不向人低头。你那看似温柔的外表只是你为了减少社交成本而穿的保护色，其实你心里在疯狂翻白眼。`
        },
        {
            dimension: `F`,
            level: `油腻肥宅`,
            subtitle: `外表可能很精致/正常`,
            emoji: `🍟`,
            desc: `别看你平时衣冠楚楚，一到深夜，你的灵魂就属于游戏、番剧和零食。你极度讨厌出门，觉得外卖是伟大的发明。你对纸片人有超越三次元的热情，懒得维持复杂的人际关系。你的终极梦想是：带薪拉屎，并且永远不会断网。`
        },
        {
            dimension: `Z`,
            level: `热血中二病`,
            subtitle: `外表可能很老实/低调`,
            emoji: `⚔️`,
            desc: `封印在我的右手中的黑暗力量啊……其实你心里一直觉得自己不是个普通人。你渴望冒险，渴望被卷入离奇的事件中。你看问题的视角总是很宏大，经常把日常小事脑补成拯救世界的剧本。虽然表面不说，但你的中二之魂永远在燃烧！`
        },
        {
            dimension: `X`,
            level: `佛系咸鱼`,
            subtitle: `外表可能很努力`,
            emoji: `💤`,
            desc: `毁灭吧，赶紧的。这是你的座右铭。你对什么都提不起劲，觉得努力没有意义，躺平才是真理。你不是不能做事，而是觉得差不多就行了。你的内心是一片平静的死水，哪怕是天塌下来，只要不是砸到自己头上，你连眼皮都不会抬一下。`
        },
        {
            dimension: `B`,
            level: `腹黑反派`,
            subtitle: `外表可能很单纯/热情`,
            emoji: `🎭`,
            desc: `笑面虎就是为你量身定制的。你极度聪明且善于隐藏，喜欢掌控全局。当别人以为你在夸他的时候，其实你心里在骂他傻X。你记仇，但绝不会当场发作，而是像猫捉老鼠一样，慢慢看对方落入你设下的陷阱。你的内心是一片漆黑的深渊。`
        },
        {
            dimension: `S`,
            level: `阳光社牛`,
            subtitle: `外表可能很社恐`,
            emoji: `🎤`,
            desc: `只要给你一个舞台，你就能疯狂输出。你其实是典型的假性社恐，只要环境对了，你比谁都疯。你极度渴望被关注，喜欢热闹，害怕孤独。你的内心像个永动机，需要不断从外界吸收能量和认可。对你来说，没有冷场，只有不够努力的社牛。`
        },
        {
            dimension: `W`,
            level: `文艺抑郁`,
            subtitle: `外表可能很开朗`,
            emoji: `🍂`,
            desc: `你的灵魂自带一层灰色的滤镜。你总是觉得没人能真正懂你，喜欢在深夜听悲伤的歌，看伤感的文字。你心思细腻，别人的一句无心之言能让你难过三天。你向往破碎感，你的内心是一座孤岛，你在岛上种满了悲伤的花。`
        },
        {
            dimension: `P`,
            level: `暴躁老哥/老姐`,
            subtitle: `外表可能很温和`,
            emoji: `🧨`,
            desc: `你的脾气就像一个火药桶，一点就炸。你极度缺乏耐心，最讨厌别人磨叽、装傻或者不守规矩。你的内心其实很纯粹：顺我者昌，逆我者滚。你懒得心机算尽，有气当场就撒。如果外表看起来很温和，那只是因为你还没遇到让你破防的阈值。`
        },
        {
            dimension: `C`,
            level: `精明财迷`,
            subtitle: `外表可能很大方`,
            emoji: `💰`,
            desc: `在你眼里，万物皆可标价。你做的每一个决定，潜意识里都在计算投入产出比。你不是小气，而是把钱看得很重，因为钱能给你带来最大的安全感。哪怕朋友请你吃饭，你心里也会默默记下这顿饭值多少钱，下次一定要还回去。你的内心账本，一笔笔记得清清楚楚。`
        }
    ]
});
