insert into profiles (user_id, display_name, is_anonymous, message, time_in_recovery, substances, milestone_note) values
('seed-mara', 'Mara', false, 'The keys stay on the hook. That is the whole miracle.', '5-plus', '["alcohol"]', 'Six years. Still a person, not a project.'),
('seed-james', 'James', false, 'I came back on a Thursday. Thursdays are still my favorite.', 'first-year', '["opioids"]', 'Fourteen months, a slip, then the 15th month.'),
('seed-dee', 'Dee', false, 'Same hands. Different job.', '1-5', '["stimulants"]', 'I teach shop now. The kids do not need my confession. They need the next bolt.'),
('seed-anon', 'Someone who made it', true, 'The app is still on my phone. I do not open it.', 'first-year', '["gambling"]', 'One year of not placing a bet. Quiet on purpose.'),
('seed-luis', 'Luis', false, 'We are not a museum of our worst days. We are a practice.', '5-plus', '["alcohol"]', 'Twenty-two years. I still say my name in rooms.'),
('seed-priya', 'Priya', false, 'I am more than the voicemail. I am also someone who needed to hear it.', '1-5', '["opioids"]', 'Two years. The compass still works.');

insert into stories (id, user_id, author_name, is_anonymous, title, body, medium, tags, recovery_time, theme, spark_votes, created_at) values
('story-keys', 'seed-mara', 'Mara', false, 'The night I didn''t drive',
$body$I had the keys in my hand. My daughter was asleep upstairs. I put them back on the hook.

That was the whole miracle — not a white light, not a choir. A set of keys and a decision so small it barely had a name. The next morning I called a meeting. I sat in the back and shook.

I still have those keys. I don't drive with them when I'm angry. If you are holding yours right now: you can put them down. The night will still be there in the morning, and you will be too.$body$,
'text', '["alcohol"]', '5-plus', 'rock-bottom', 48, now() - interval '40 days'),

('story-year-one', 'seed-james', 'James', false, 'Year one is not a movie',
$body$Nobody tells you the first year is boring. You eat. You sleep. You go to work with a headache. You don't become a new person. You become a person who does the next right thing while still wanting the old thing.

That's the whole job.

I wanted a montage. I got pancakes at 9pm and a lot of unfinished feelings. If you are in it: this is what making it looks like from the inside. It is not cinematic. It is enough.$body$,
'text', '["opioids"]', 'first-year', 'first-year', 61, now() - interval '22 days'),

('story-angry', 'seed-mara', 'Mara', false, 'I had to let them be angry',
$body$My mother didn't clap when I got 90 days. She said, "We'll see." She was right to. I had promised her before.

The work was not convincing her. The work was becoming someone she didn't have to watch. That took longer than 90 days. It is still taking.

If your people are slow to trust you: they are not the enemy. They are the record. Let them have their time. Use yours.$body$,
'text', '["alcohol"]', '5-plus', 'family', 33, now() - interval '18 days'),

('story-thursday', 'seed-james', 'James', false, 'I came back on a Thursday',
$body$I used. I thought that meant the previous 14 months were fake. A woman at the table said, "Then those 14 months are still yours. Start the 15th."

I hated how simple that was. I came back on a Thursday. Thursdays are still my favorite.

Relapse is not a verdict. It is information. You can come back on a Thursday too.$body$,
'text', '["opioids"]', 'first-year', 'relapse-return', 72, now() - interval '11 days'),

('story-shop', 'seed-dee', 'Dee', false, 'I teach shop now',
$body$I used to take things apart that weren't mine. Now I teach kids to put engines together. Same hands. Different job.

If you're looking for a reason to stay, it might already be in the things you were good at before you got sick. You don't have to become a speaker. You can become useful.

The first time a kid got a motor to turn over, I cried in the supply closet. That is also recovery.$body$,
'text', '["stimulants"]', '1-5', 'purpose', 44, now() - interval '9 days'),

('story-app', 'seed-anon', 'Someone who made it', true, 'The app is still on my phone',
$body$I didn't delete it for a year. I needed to know I could look at it and not open it. That's not advice. That's just what I did.

The urge still visits. I let it sit in the chair by the door and I don't offer it coffee.

If gambling had you: the notifications will lie. You can leave them unread. You can also delete the app tomorrow. Either is a day you kept.$body$,
'text', '["gambling"]', 'first-year', 'still-here', 29, now() - interval '7 days'),

('story-parking', 'seed-luis', 'Luis', false, 'For whoever is in the parking lot',
$body$If you're sitting in the car outside the meeting and you can't go in: the coffee is bad and nobody will make you talk. You can just sit. That's how I started. You can just sit.

I have 22 years and I still get the parking-lot feeling some nights. I go in anyway, or I sit, or I call someone from the car. All three count.

We saved you a seat. It doesn't expire.$body$,
'voice', '["alcohol"]', '5-plus', 'still-here', 91, now() - interval '5 days'),

('story-voicemail', 'seed-priya', 'Priya', false, 'The voicemail I didn''t delete',
$body$It's 11 seconds of me not making sense. I keep it. Not as punishment. As a compass. When I start thinking I could handle "just one," I play it.

I am more than that voicemail. I am also someone who needed to hear it.

You can keep a compass without living in the wreck. That distinction took me a long time.$body$,
'text', '["opioids"]', '1-5', 'rock-bottom', 38, now() - interval '4 days'),

('story-24', 'seed-dee', 'Dee', false, 'I got sober at 24 and felt ancient',
$body$Everyone at work was going out. I went to a diner and ate pancakes at 9pm. It was lonely and it was the bravest thing I had done.

If you are young and stopping: you are not missing your life. You are finally arriving to it. The parties will still be there. Some of them will look smaller from here.

Find one person your age in a room. If you can't, find one person who remembers being 24. Sit with them.$body$,
'text', '["stimulants"]', '1-5', 'first-year', 55, now() - interval '2 days'),

('story-name', 'seed-luis', 'Luis', false, 'Twenty-two years and I still say my name',
$body$I still say "I'm an alcoholic" in rooms. Not because I am the worst thing I did. Because I don't want to forget the rooms that kept me.

If you're new: we are not a museum of our worst days. We are a practice. Come back tomorrow. Come back after you don't want to. That is the whole tradition, dressed in bad coffee.$body$,
'voice', '["alcohol"]', '5-plus', 'purpose', 67, now() - interval '1 day');

insert into sparks (id, user_id, body, author_name, is_anonymous) values
('spark-1', 'aftermath-seed', 'You can just sit. You don''t have to talk.', 'Luis', false),
('spark-2', 'aftermath-seed', 'The urge is a visitor. You don''t have to serve it dinner.', 'Someone who made it', true),
('spark-3', 'aftermath-seed', 'One hour. That''s a whole life if you fill it.', 'Mara', false),
('spark-4', 'aftermath-seed', 'You are not your worst day. You are also the day you came back.', 'James', false),
('spark-5', 'aftermath-seed', 'Call someone before you decide anything.', 'Priya', false),
('spark-6', 'aftermath-seed', 'Eat something. Drink water. Then decide.', 'Dee', false),
('spark-7', 'aftermath-seed', 'It counts even if no one sees it.', 'Someone who made it', true),
('spark-8', 'aftermath-seed', 'Relapse is not a verdict. It''s information.', 'James', false),
('spark-9', 'aftermath-seed', 'You can leave the parking lot. You can also go in.', 'Luis', false),
('spark-10', 'aftermath-seed', 'Stay for the closing. That''s the whole meeting sometimes.', 'Mara', false),
('spark-11', 'aftermath-seed', 'The person you were is not the enemy. They were surviving.', 'Dee', false),
('spark-12', 'aftermath-seed', 'We saved you a seat. It doesn''t expire.', 'Luis', false);

insert into tributes (id, user_id, honoree_name, relationship, body, years, created_at) values
('tr-1', 'seed-mara', 'Daniel R.', 'Brother',
'He taught me to skip stones and later I could not teach him to stay. I say his name in January. I keep his jacket. I do not pretend the rooms could have done what they did not do. I carry him, and I stay.',
'1991–2019', now() - interval '30 days'),
('tr-2', 'seed-luis', 'Annie from the Tuesday table', 'Friend from the rooms',
'Annie had 11 months and a laugh that made the coffee less terrible. We lost her in a week that should have been ordinary. I still leave the chair beside me a little open.',
'— 2021', now() - interval '20 days'),
('tr-3', 'seed-priya', 'Mom', 'Mother',
'She did not live to see two years. She did live to see me eat breakfast. I think that was the thing she wanted. I eat breakfast.',
'1958–2024', now() - interval '12 days'),
('tr-4', 'seed-dee', 'Chris', 'Best friend',
'We started together. I got out. He did not. I do not tell that as a cautionary tale with a bow on it. I tell it because he was funny, and he loved terrible movies, and he was more than what killed him.',
'1996–2022', now() - interval '8 days'),
('tr-5', 'seed-james', 'A girl from detox whose name I lost', 'Someone I sat with',
'We played cards for three nights. I do not know if she made it. I hope she did. This is for her anyway.',
'', now() - interval '3 days');

insert into circles (id, name, stage, focus, description) values
('circle-90', 'First 90', 'Early', 'Any', 'A small table for people in the first three months. No speeches. Check in, sit, leave when you need to.'),
('circle-alcohol', 'Clear mornings', 'Any stage', 'Alcohol', 'For people putting the drink down. Stories, slips, and the boring middle.'),
('circle-opioids', 'Still here', 'Any stage', 'Opioids', 'Peer support for opioid recovery. Medication, meetings, and the long after.'),
('circle-night', 'Late night watch', 'Still fighting', 'Any', 'When the house is quiet and the urge is not. Short check-ins. No pressure to be well.'),
('circle-repair', 'Family & repair', '1+ year', 'Any', 'For the slow work of becoming someone your people don''t have to watch.');

insert into circle_posts (id, circle_id, user_id, author_name, body, created_at) values
('cp-1', 'circle-90', 'seed-james', 'James', 'Day 19. Slept. Ate. Did not use. That is the report.', now() - interval '6 hours'),
('cp-2', 'circle-90', 'seed-anon', 'Someone who made it', 'The afternoon window is the hardest. I am going for a walk instead of opening the app.', now() - interval '4 hours'),
('cp-3', 'circle-alcohol', 'seed-mara', 'Mara', 'Someone asked how I knew I was an alcoholic. I said: I kept choosing it after it stopped being fun. That was enough of a definition.', now() - interval '1 day'),
('cp-4', 'circle-night', 'seed-priya', 'Priya', 'It''s 1:14am and I am here instead of the other place. If you are awake too, you can just type "here."', now() - interval '2 hours'),
('cp-5', 'circle-repair', 'seed-luis', 'Luis', 'Amends are not performances. I asked my son what he needed. He said time. I am giving him time.', now() - interval '2 days');
