// Database Seed Script for EduLearn
// Seeds the ICT Python Programming course with 13 real Google Drive videos

import { PrismaClient, UserRole, ContentType, UserStatus } from '@prisma/client';
import { extractDriveFileId } from '../src/lib/utils';

const prisma = new PrismaClient();

// Real Google Drive Video Data - ICT Python Programming
const ICT_PYTHON_VIDEOS = [
  {
    topicTitle: 'প্রোগ্রামিং, কম্পাইলার, ইন্টারপ্রেটার',
    topicOrder: 1,
    videos: [
      {
        title: 'প্রোগ্রামিং, কম্পাইলার, ইন্টারপ্রেটার',
        driveUrl: 'https://drive.google.com/file/d/1UKAu7CkpJ0CApLJ_ul3HP1D89AhRHeQC/view?usp=drive_link',
        description: 'প্রোগ্রামিং, কম্পাইলার এবং ইন্টারপ্রেটারের মৌলিক ধারণা',
      },
    ],
  },
  {
    topicTitle: 'চলকের ধারণা',
    topicOrder: 2,
    videos: [
      {
        title: 'চলকের ধারণা',
        driveUrl: 'https://drive.google.com/file/d/19Q9LDqtGosgYCj6LEtF2HSddH07xvzaX/view?usp=drive_link',
        description: 'প্রোগ্রামিং-এ চলক (Variable) কী এবং কেন এটি ব্যবহার করা হয়',
      },
    ],
  },
  {
    topicTitle: 'পাইথন সফটওয়্যার ইন্সটলেশন',
    topicOrder: 3,
    videos: [
      {
        title: 'পাইথন সফটওয়্যার ইন্সটলেশন',
        driveUrl: 'https://drive.google.com/file/d/1yacwJ0x8wJvdQCah8CcE9dBFqV5kZW6r/view?usp=sharing',
        description: 'পাইথন ইন্সটল করার পূর্ণ প্রক্রিয়া ধাপে ধাপে',
      },
    ],
  },
  {
    topicTitle: 'চলকের নামকরণ',
    topicOrder: 4,
    videos: [
      {
        title: 'চলকের নামকরণ',
        driveUrl: 'https://drive.google.com/file/d/1feTGVcj8xYEYE_fPn5l9P0CTJ5Yyqrzc/view?usp=drivesdk',
        description: 'পাইথনে চলকের নাম রাখার নিয়ম ও কনভেনশন',
      },
    ],
  },
  {
    topicTitle: 'চলকে মান এসাইন',
    topicOrder: 5,
    videos: [
      {
        title: 'চলকে মান এসাইন',
        driveUrl: 'https://drive.google.com/file/d/1Mfpb1t7HMorhowaIpSVjzT-9EDfJdcjS/view?usp=drive_link',
        description: 'চলকে মান تعيين করার পদ্ধতি ও উদাহরণ',
      },
    ],
  },
  {
    topicTitle: 'ডাটা টাইপ',
    topicOrder: 6,
    videos: [
      {
        title: 'ডাটা টাইপ',
        driveUrl: 'https://drive.google.com/file/d/1yfOn0Atug-LsDFgKDJs1gKmq8a-sVH2N/view?usp=drivesdk',
        description: 'পাইথনের বিভিন্ন ডাটা টাইপ ও তাদের ব্যবহার',
      },
    ],
  },
  {
    topicTitle: 'টাইপকাস্টিং',
    topicOrder: 7,
    videos: [
      {
        title: 'টাইপকাস্টিং',
        driveUrl: 'https://drive.google.com/file/d/1EYgkqC2SoZHO4UbXuqfkfeSdBpkfcqvP/view?usp=drivesdk',
        description: 'এক ডাটা টাইপ থেকে অন্য ডাটা টাইপে রূপান্তর (Type Casting)',
      },
    ],
  },
  {
    topicTitle: 'ইনপুট',
    topicOrder: 8,
    videos: [
      {
        title: 'ইনপুট-১',
        driveUrl: 'https://drive.google.com/file/d/1TC0Snk4m03UYsqv8oQj69muKS6qgKWyJ/view?usp=drivesdk',
        description: 'ইনপুট নেওয়ার মৌলিক পদ্ধতি - भाग ১',
      },
      {
        title: 'ইনপুট-২',
        driveUrl: 'https://drive.google.com/file/d/1ZCzbIAvHfFX_gBVmxo0yFqW-tHCSKTbX/view?usp=drivesdk',
        description: 'ইনপুট নেওয়ার মৌলিক পদ্ধতি - भाग ২',
      },
    ],
  },
  {
    topicTitle: 'অপারেটর',
    topicOrder: 9,
    videos: [
      {
        title: 'অপারেটর',
        driveUrl: 'https://drive.google.com/file/d/1PBWTBJNMJlvUAQcaf--TLa8_2HoGSEs1/view?usp=drivesdk',
        description: 'পাইথনে বিভিন্ন ধরণের অপারেটর ও তাদের ব্যবহার',
      },
    ],
  },
  {
    topicTitle: 'তুলনা',
    topicOrder: 10,
    videos: [
      {
        title: 'তুলনা',
        driveUrl: 'https://drive.google.com/file/d/1ZKVGv3npnemUi9_tkOncGEpLVIq7d-e6/view?usp=drivesdk',
        description: 'তুলনামূলক অপারেটর ও শর্তাবলী লেখা',
      },
    ],
  },
  {
    topicTitle: 'if statement',
    topicOrder: 11,
    videos: [
      {
        title: 'if statement',
        driveUrl: 'https://drive.google.com/file/d/16J6eBTH6jV_1Lp_4JjKg3MoTYvM6pgFS/view?usp=drivesdk',
        description: 'if শর্তাবলীর সিনট্যাক্স ও ব্যবহার',
      },
    ],
  },
  {
    topicTitle: 'if-else statement',
    topicOrder: 12,
    videos: [
      {
        title: 'if-else statement',
        driveUrl: 'https://drive.google.com/file/d/1MBF40Q7z5pMOjWsc8RPf6gvFvjzTARN5/view?usp=drivesdk',
        description: 'if-else শর্তাবলীর পূর্ণ ব্যবহার ও উদাহরণ',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create or get ICT Subject
  let ictSubject = await prisma.subject.findFirst({
    where: { title: 'ICT' },
  });

  if (!ictSubject) {
    ictSubject = await prisma.subject.create({
      data: {
        title: 'ICT',
        description: 'তথ্য ও যোগাযোগ প্রযুক্তি (Information and Communication Technology)',
        icon: '💻',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        order: 1,
        published: true,
      },
    });
    console.log('✅ Created Subject: ICT');
  } else {
    console.log('📌 Subject ICT already exists');
  }

  // 2. Create or get Python Programming Chapter
  let pythonChapter = await prisma.chapter.findFirst({
    where: {
      subjectId: ictSubject.id,
      title: 'Python Programming',
    },
  });

  if (!pythonChapter) {
    pythonChapter = await prisma.chapter.create({
      data: {
        subjectId: ictSubject.id,
        title: 'Python Programming',
        description: 'পাইথন প্রোগ্রামিং ভাষার মৌলিক থেকে উন্নত ধারণা শিখুন',
        order: 1,
        published: true,
      },
    });
    console.log('✅ Created Chapter: Python Programming');
  } else {
    console.log('📌 Chapter Python Programming already exists');
  }

  // 3. Create Topics and Videos
  let totalVideosCreated = 0;
  let totalTopicsCreated = 0;

  for (const topicData of ICT_PYTHON_VIDEOS) {
    // Check if topic exists
    let topic = await prisma.topic.findFirst({
      where: {
        chapterId: pythonChapter.id,
        title: topicData.topicTitle,
      },
    });

    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          chapterId: pythonChapter.id,
          title: topicData.topicTitle,
          description: `${topicData.topicTitle} সম্পর্কিত লেকচার ও নোটস`,
          order: topicData.topicOrder,
          published: true,
        },
      });
      totalTopicsCreated++;
      console.log(`✅ Created Topic ${topicData.topicOrder}: ${topicData.topicTitle}`);
    } else {
      console.log(`📌 Topic ${topicData.topicOrder}: ${topicData.topicTitle} already exists`);
    }

    // Add videos for this topic
    for (let i = 0; i < topicData.videos.length; i++) {
      const videoData = topicData.videos[i];
      const driveFileId = extractDriveFileId(videoData.driveUrl);

      if (!driveFileId) {
        console.warn(`⚠️ Could not extract Drive File ID from: ${videoData.driveUrl}`);
        continue;
      }

      // Check if video already exists
      const existingVideo = await prisma.learningMaterial.findUnique({
        where: { driveFileId },
      });

      if (existingVideo) {
        console.log(`📌 Video already exists: ${videoData.title} (${driveFileId})`);
        continue;
      }

      // Create video material
      await prisma.learningMaterial.create({
        data: {
          topicId: topic.id,
          type: ContentType.VIDEO,
          title: videoData.title,
          description: videoData.description,
          driveFileId,
          order: i + 1,
          published: true,
        },
      });
      totalVideosCreated++;
      console.log(`✅ Created Video: ${videoData.title} [${driveFileId}]`);
    }
  }

  // 4. Create additional subjects (placeholder for future content)
  const otherSubjects = [
    { title: 'Physics', icon: '⚛️', order: 2, color: 'bg-red-500' },
    { title: 'Chemistry', icon: '🧪', order: 3, color: 'bg-orange-500' },
    { title: 'Biology', icon: '🧬', order: 4, color: 'bg-green-500' },
    { title: 'Mathematics', icon: '📐', order: 5, color: 'bg-blue-500' },
  ];

  for (const subj of otherSubjects) {
    const existing = await prisma.subject.findFirst({
      where: { title: subj.title },
    });

    if (!existing) {
      await prisma.subject.create({
        data: {
          title: subj.title,
          description: `${subj.title} বিষয়ের পূর্ণ কোর্স`,
          icon: subj.icon,
          order: subj.order,
          published: false, // Not published yet
        },
      });
      console.log(`✅ Created Subject: ${subj.title} (draft)`);
    }
  }

  // 5. Create initial admin user (if INITIAL_ADMIN_EMAIL is set)
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  if (adminEmail) {
    const adminExists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'System Administrator',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });
      console.log(`✅ Created Admin User: ${adminEmail}`);
    } else {
      console.log(`📌 Admin user ${adminEmail} already exists`);
    }
  }

  // 6. Create default app settings
  const defaultSettings = [
    { key: 'site_name', value: 'EduLearn', description: 'Application name' },
    { key: 'site_description', value: 'শিখুন, অগ্রসর হন', description: 'Site tagline' },
    { key: 'default_language', value: 'bn', description: 'Default language' },
    { key: 'maintenance_mode', value: 'false', description: 'Maintenance mode toggle' },
    { key: 'allow_registration', value: 'true', description: 'Allow new student registration' },
    { key: 'video_quality_default', value: '720p', description: 'Default video quality' },
    { key: 'enable_progress_tracking', value: 'true', description: 'Enable learning progress tracking' },
    { key: 'enable_bookmarks', value: 'true', description: 'Enable bookmark feature' },
    { key: 'max_upload_size_mb', value: '500', description: 'Maximum upload size in MB' },
  ];

  for (const setting of defaultSettings) {
    await prisma.appSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Default app settings created/updated');

  console.log('\n📊 Seed Summary:');
  console.log(`   Subjects: ${await prisma.subject.count()}`);
  console.log(`   Chapters: ${await prisma.chapter.count()}`);
  console.log(`   Topics: ${await prisma.topic.count()} (${totalTopicsCreated} new)`);
  console.log(`   Videos: ${await prisma.learningMaterial.count({ where: { type: ContentType.VIDEO } })} (${totalVideosCreated} new)`);
  console.log(`   PDFs: ${await prisma.learningMaterial.count({ where: { type: ContentType.PDF } })}`);
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });