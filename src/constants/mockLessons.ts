import { Lesson } from '../types/lesson';
import { parseSrtOrVtt } from '../utils/srtParser';

// Sample SRT 1: Steve Jobs Stanford Speech (Stay Hungry, Stay Foolish)
const STEVE_JOBS_SRT = `
1
00:00:00,500 --> 00:00:04,200
I am honored to be with you today at your commencement.
我很荣幸今天能参加你们的毕业典礼。

2
00:00:04,300 --> 00:00:08,800
from one of the finest universities in the world.
这是一所世界上最优秀的大学之一。

3
00:00:09,100 --> 00:00:13,600
Truth be told, I never graduated from college.
说实话，我其实从来没有大学毕业过。

4
00:00:14,000 --> 00:00:19,200
This is the closest I've ever gotten to a college graduation.
这大概是我这辈子离大学毕业最近的一次了。

5
00:00:19,800 --> 00:00:24,900
Today I want to tell you three stories from my life.
今天我想向大家讲述我人生中的三个故事。

6
00:00:25,300 --> 00:00:28,200
That's it. No big deal. Just three stories.
没什么大不了的，就仅仅是三个故事而已。

7
00:00:29,000 --> 00:00:32,800
The first story is about connecting the dots.
第一个故事，是关于串联起生命中的点点滴滴。

8
00:00:33,200 --> 00:00:37,500
I dropped out of Reed College after the first six months.
我在里德学院读了最初的六个月后就退学了。

9
00:00:38,000 --> 00:00:43,400
Much of what I stumbled into by following my curiosity turned out to be priceless.
许多纯粹随好奇心和直觉探索而偶遇的事物，后来被证明是无价之宝。

10
00:00:44,000 --> 00:00:48,900
I learned about serif and sans-serif typefaces, about typography.
我学到了关于衬线体与无衬线字体，学到了排版艺术。

11
00:00:49,500 --> 00:00:54,800
It was beautiful, historical, and artistically subtle in a way that science can't capture.
它有着科学无法捕捉的美感、历史底蕴与艺术沉淀。

12
00:00:55,200 --> 00:01:00,000
You have to trust in something: your gut, destiny, life, karma, whatever.
你必须有所坚信：直觉、命运、生命、因果，无论什么。
`;

// Sample SRT 2: Julian Treasure - How to speak so people want to listen
const HOW_TO_SPEAK_SRT = `
1
00:00:00,600 --> 00:00:04,800
The human voice: it's the instrument we all play.
人类的嗓音：是我们所有人都会演奏的乐器。

2
00:00:05,200 --> 00:00:09,500
It's the most powerful sound in the world, probably.
它很可能是世界上最具震撼力和感染力的声音。

3
00:00:10,000 --> 00:00:14,200
It's the only one that can start a war or say I love you.
它是唯一既能发动战争，又能倾诉“我爱你”的声音。

4
00:00:14,800 --> 00:00:19,500
And yet many people have the experience that when they speak, people don't listen.
然而许多人都有过这样的经历：当他们开口时，别人却心不在焉。

5
00:00:20,000 --> 00:00:25,800
I would like to suggest that there are seven deadly sins of speaking.
我想指出，在言语交流中存在着七宗致命之罪。

6
00:00:26,200 --> 00:00:31,000
Gossip: speaking ill of somebody who's not present.
八卦闲话：在背后议论一个不在场的人。

7
00:00:31,500 --> 00:00:36,500
Judging: it's very hard to talk to somebody if you know they're judging you.
指责评判：如果你知道对方在评判你，交谈就会变得异常艰难。

8
00:00:37,000 --> 00:00:43,000
Negativity: it's hard to listen when somebody is always complaining about life.
消极抱怨：当一个人总是在怨天尤人时，倾听会变得极其沉重。
`;

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Connecting the Dots (Stanford Speech)',
    speaker: 'Steve Jobs',
    description: 'Steve Jobs reflects on dropping out of college, learning calligraphy, and trusting your intuition.',
    // Public high-quality MP4 stream URL
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 60,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    difficulty: 'Intermediate',
    subtitles: parseSrtOrVtt(STEVE_JOBS_SRT),
  },
  {
    id: 'lesson-2',
    title: 'How to Speak So People Want to Listen',
    speaker: 'Julian Treasure (TED)',
    description: 'A masterclass on voice, vocal power, empathy, and avoiding the seven deadly sins of speaking.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 43,
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
    difficulty: 'Advanced',
    subtitles: parseSrtOrVtt(HOW_TO_SPEAK_SRT),
  },
];
