import { Course, CohortStudentProgress, StudentProfile } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-english-beginners-a1-a2',
    title: 'English Beginners Level (A1-A2)',
    subtitle: 'Master Everyday English Fundamentals, Core Vocabulary & Conversational Fluency',
    description: 'A comprehensive foundational English course specifically designed for beginner language learners (A1-A2). Features 4 complete modules: English Primary One, Numbers, Administrative, and Demonstrative, covering school, daily life, numerical fluency, demonstratives, negatives, and sentence structures, accompanied by official course notes and study guides.',
    category: 'English for Beginners',
    level: 'Beginner',
    instructor: {
      name: 'Abdifatah Jama',
      role: 'Lead English Language Educator',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
      bio: 'Experienced English language educator specializing in practical vocabulary, pronunciation, conversational fluency, and ESL instruction.'
    },
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
    estimatedHours: 14,
    updatedAt: '2026-09-25',
    tags: ['English Beginners Level (A1-A2)', 'Beginner English', 'A1-A2', 'English Primary One', 'Numbers', 'Administrative', 'Demonstrative', 'Vocabulary', 'Grammar', 'Speaking', 'ESL'],
    price: 25,
    originalPrice: 50,
    discountPercent: 50,
    totalLessonsCount: 56,
    resources: [
      {
            "id": "res-beg-note-1",
            "title": "Beginner Words Reference Notes (PDF)",
            "url": "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5",
            "type": "pdf",
            "size": "2.4 MB"
      },
      {
            "id": "res-beg-note-2",
            "title": "ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)",
            "url": "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e",
            "type": "pdf",
            "size": "4.8 MB"
      },
      {
            "id": "res-beg-numbers-pdf",
            "title": "Numbers Reference Notes & Study Guide (PDF)",
            "url": "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9",
            "type": "pdf",
            "size": "1.8 MB"
      }
    ],
    modules: [
      {
        id: 'mod-primary-one',
        title: 'English Primary One',
        description: 'Comprehensive 37-lesson foundation series covering beginner daily expressions, school, home, food, time, sentence structures, and official study materials, followed by a final mastery check.',
        lessons: [
          {
            id: 'beg-lesson-1',
            moduleId: 'mod-primary-one',
            title: "Lesson 1: Introduction to Beginner English (A1-A2 Overview)",
            description: "Welcome to English Primary One. Discover foundational English principles, study techniques, and daily conversational targets.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBEGINNER%20LEVEL.mp4?alt=media&token=6ebfeb9e-a951-4ca0-8257-c15ce8919c85",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBEGINNER%20LEVEL.mp4?alt=media&token=6ebfeb9e-a951-4ca0-8257-c15ce8919c85", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-2',
            moduleId: 'mod-primary-one',
            title: "Lesson 2: At School - Essential Vocabulary & Phrases",
            description: "Vocabulary for school items, teachers, classrooms, routine activities, and everyday student expressions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAT%20SCHOOL%20-%20LESSON%2021.mp4?alt=media&token=b541cee5-53f1-4f43-b9c5-6cc25363863f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAT%20SCHOOL%20-%20LESSON%2021.mp4?alt=media&token=b541cee5-53f1-4f43-b9c5-6cc25363863f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-3',
            moduleId: 'mod-primary-one',
            title: "Lesson 3: At the Beach - Vacation & Leisure Vocabulary",
            description: "Words for seaside activities, water sports, summer weather, and holiday leisure vocabulary.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAT%20THE%20BEACH%20-%20LESSON%2022.mp4?alt=media&token=88849314-9ec6-4531-856b-5c78d50dcd22",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAT%20THE%20BEACH%20-%20LESSON%2022.mp4?alt=media&token=88849314-9ec6-4531-856b-5c78d50dcd22", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-4',
            moduleId: 'mod-primary-one',
            title: "Lesson 4: Body Parts & Physical Vocabulary",
            description: "Learn the English names for parts of the body, head to toe, with clear pronunciation and usage.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBODY%20PARTS%20-%20LESSON%2017.mp4?alt=media&token=d67eaf91-fa75-4105-a699-d320920f1ca8",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBODY%20PARTS%20-%20LESSON%2017.mp4?alt=media&token=d67eaf91-fa75-4105-a699-d320920f1ca8", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-5',
            moduleId: 'mod-primary-one',
            title: "Lesson 5: Conversation - Easy Daily Dialogues",
            description: "Simple conversational patterns, asking friendly questions, responding politely, and basic social chat.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FCONVERSATION%20-%20LESSON%2018.mp4?alt=media&token=eec2fc38-8b03-43d8-b3e8-ba3412e6cc3d",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FCONVERSATION%20-%20LESSON%2018.mp4?alt=media&token=eec2fc38-8b03-43d8-b3e8-ba3412e6cc3d", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-6',
            moduleId: 'mod-primary-one',
            title: "Lesson 6: Daily Expressions & Common English Phrases",
            description: "High-frequency everyday idioms, casual phrases, and polite expressions for daily interaction.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDAILY%20EXPRESSION%20-%20%20%20LESSON%2020.mp4?alt=media&token=6aee73a2-c1f2-4a94-b07b-39f7f75beec0",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDAILY%20EXPRESSION%20-%20%20%20LESSON%2020.mp4?alt=media&token=6aee73a2-c1f2-4a94-b07b-39f7f75beec0", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-7',
            moduleId: 'mod-primary-one',
            title: "Lesson 7: Days of the Week & Calendar Words",
            description: "Learn Monday through Sunday, weekdays vs weekends, and prepositions of time with days.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDAYS%20OF%20THE%20WEEK%20-%20%20%20%20%20%20LESSON%2019.mp4?alt=media&token=ca3dfe4f-ee0a-41af-9b91-3ce0072fe269",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDAYS%20OF%20THE%20WEEK%20-%20%20%20%20%20%20LESSON%2019.mp4?alt=media&token=ca3dfe4f-ee0a-41af-9b91-3ce0072fe269", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-8',
            moduleId: 'mod-primary-one',
            title: "Lesson 8: Describing Classroom Objects",
            description: "Describe common school and office items: desks, pens, notebooks, erasers, and boards.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20CLASSROOM%20OBJECTS%20-%20LESSON%2028.mp4?alt=media&token=ec7eaaec-eb83-4619-9ba0-addecea84a3b",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20CLASSROOM%20OBJECTS%20-%20LESSON%2028.mp4?alt=media&token=ec7eaaec-eb83-4619-9ba0-addecea84a3b", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-9',
            moduleId: 'mod-primary-one',
            title: "Lesson 9: Describing Clothes & What People Wear",
            description: "Clothing vocabulary: shirts, pants, jackets, shoes, colors, and using the verb wearing.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20CLOTHES%20-%20%20%20%20%20LESSON%209.mp4?alt=media&token=4eb0a939-4263-4873-aa54-dd62ef9cf734",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20CLOTHES%20-%20%20%20%20%20LESSON%209.mp4?alt=media&token=4eb0a939-4263-4873-aa54-dd62ef9cf734", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-10',
            moduleId: 'mod-primary-one',
            title: "Lesson 10: Describing Colours & Visual Appearance",
            description: "Colors, shades, patterns, and combining adjectives with nouns to describe things visually.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20COLOURS%20-%20%20%20%20%20LESSON%2010.mp4?alt=media&token=07348ee1-3d4f-4194-b8df-bc9c77f45ad2",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20COLOURS%20-%20%20%20%20%20LESSON%2010.mp4?alt=media&token=07348ee1-3d4f-4194-b8df-bc9c77f45ad2", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-11',
            moduleId: 'mod-primary-one',
            title: "Lesson 11: Describing Food & Flavors",
            description: "Words for everyday foods, meals, fruits, vegetables, and taste adjectives (sweet, salty, savory).",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20FOOD%20%20-%20%20%20%20%20%20%20LESSON%2011.mp4?alt=media&token=1d6e9f51-b8c4-4e14-abe2-6b2c8e4e1410",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20FOOD%20%20-%20%20%20%20%20%20%20LESSON%2011.mp4?alt=media&token=1d6e9f51-b8c4-4e14-abe2-6b2c8e4e1410", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-12',
            moduleId: 'mod-primary-one',
            title: "Lesson 12: Describing Position & Prepositions of Place",
            description: "Spatial prepositions: in, on, under, behind, next to, in front of, and between.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20POSITION%20-%20%20%20%20LESSON%2012.mp4?alt=media&token=f6d29ed7-8535-496c-bcb0-315aa61593b8",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDESCRIBING%20POSITION%20-%20%20%20%20LESSON%2012.mp4?alt=media&token=f6d29ed7-8535-496c-bcb0-315aa61593b8", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-13',
            moduleId: 'mod-primary-one',
            title: "Lesson 13: Family Members & Relationships",
            description: "Vocabulary for immediate and extended family members, relations, and introducing family.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FFAMILY%20-%20LESSON%2049.mp4?alt=media&token=a601397b-a622-4fd3-9d3a-2bb20403bca8",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FFAMILY%20-%20LESSON%2049.mp4?alt=media&token=a601397b-a622-4fd3-9d3a-2bb20403bca8", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-14',
            moduleId: 'mod-primary-one',
            title: "Lesson 14: Favourite Food & Likes and Dislikes",
            description: "Expressing your favorite foods, ordering at a table, and answering What is your favorite food?.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FFAVOURITE%20FOOD%20-%20LESSON%2050.mp4?alt=media&token=7083f510-f8b3-47fa-a250-08406c6af5a3",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FFAVOURITE%20FOOD%20-%20LESSON%2050.mp4?alt=media&token=7083f510-f8b3-47fa-a250-08406c6af5a3", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-15',
            moduleId: 'mod-primary-one',
            title: "Lesson 15: The Home - Rooms & Household Objects",
            description: "Rooms in the house, living room furniture, kitchen items, bedrooms, and home routines.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOME%20%20%20%20%20%20%20%20%20%20%20%20LESSON%2010.mp4?alt=media&token=66b0dd28-8e82-4860-a1e2-78f98c6604d8",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOME%20%20%20%20%20%20%20%20%20%20%20%20LESSON%2010.mp4?alt=media&token=66b0dd28-8e82-4860-a1e2-78f98c6604d8", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-16',
            moduleId: 'mod-primary-one',
            title: "Lesson 16: Asking \"How Many?\" & Plural Nouns",
            description: "Form questions asking about quantity, regular and irregular plurals, and counting items.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOW%20MANY%20-%20LESSON%2023.mp4?alt=media&token=a26653ab-7963-4ca4-ba7e-462e217d3d0f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOW%20MANY%20-%20LESSON%2023.mp4?alt=media&token=a26653ab-7963-4ca4-ba7e-462e217d3d0f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-17',
            moduleId: 'mod-primary-one',
            title: "Lesson 17: How to Greet Someone - Hello, Goodbye & Polite English",
            description: "Morning, afternoon, evening greetings, polite introductions, and saying goodbye warmly.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOW%20TO%20GREET%20SOMEONE.mp4?alt=media&token=7cf59f34-5bfe-48b1-854d-cb6ed6111c1f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FHOW%20TO%20GREET%20SOMEONE.mp4?alt=media&token=7cf59f34-5bfe-48b1-854d-cb6ed6111c1f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-18',
            moduleId: 'mod-primary-one',
            title: "Lesson 18: Sentence Building: \"I am + Verb-ing\"",
            description: "Describe actions happening right now with present continuous sentences (I am learning, I am eating).",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20AM%20%2B%20VERB%20-%20LESSON%2035.mp4?alt=media&token=5a458feb-a407-43c7-b4c6-b80b22a0c2c5",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20AM%20%2B%20VERB%20-%20LESSON%2035.mp4?alt=media&token=5a458feb-a407-43c7-b4c6-b80b22a0c2c5", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-19',
            moduleId: 'mod-primary-one',
            title: "Lesson 19: Sentence Pattern: \"I am good at...\"",
            description: "Express your talents, hobbies, and strengths with the pattern I am good at [action/skill].",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20AM%20GOOD%20AT%20-%20LESSON%2036.mp4?alt=media&token=8807234f-7094-407f-82f7-8e9836bf1d34",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20AM%20GOOD%20AT%20-%20LESSON%2036.mp4?alt=media&token=8807234f-7094-407f-82f7-8e9836bf1d34", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-20',
            moduleId: 'mod-primary-one',
            title: "Lesson 20: Expressing Abilities with \"I Can...\"",
            description: "Using modal verb can to describe skills, physical abilities, and what you are able to do.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20CAN%20-%20LESSON%2037.mp4?alt=media&token=600fb5cb-db1e-4cc0-9216-faad6b74bf75",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20CAN%20-%20LESSON%2037.mp4?alt=media&token=600fb5cb-db1e-4cc0-9216-faad6b74bf75", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-21',
            moduleId: 'mod-primary-one',
            title: "Lesson 21: Useful Expression: \"I don't have time to...\"",
            description: "Politely express a busy schedule, prioritize tasks, and decline requests courteously.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20DON%60T%20HAVE%20TIME%20TO%20-%20LESSON%2043.mp4?alt=media&token=cc1bbaa4-51b7-4397-a9e9-ecca540196d1",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20DON%60T%20HAVE%20TIME%20TO%20-%20LESSON%2043.mp4?alt=media&token=cc1bbaa4-51b7-4397-a9e9-ecca540196d1", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-22',
            moduleId: 'mod-primary-one',
            title: "Lesson 22: Expressing Possession: \"I have + Noun\"",
            description: "Talk about what you have, bring, or own with simple, clear sentences using have and has.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20HAVE%20%2B%20NOUN%20-%20LESSON%2042.mp4?alt=media&token=dfeb3c0c-984b-4588-9889-5ca932b8077f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20HAVE%20%2B%20NOUN%20-%20LESSON%2042.mp4?alt=media&token=dfeb3c0c-984b-4588-9889-5ca932b8077f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-23',
            moduleId: 'mod-primary-one',
            title: "Lesson 23: Expressing Future Intentions: \"I plan to + Verb\"",
            description: "Talk about future plans, goals, upcoming activities, and weekend routines using I plan to.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20PLAN%20TO%20%2B%20VERB%20-%20LESSON%2041.mp4?alt=media&token=e65887fc-5c47-4e5e-9722-45c8cce4d1ef",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20PLAN%20TO%20%2B%20VERB%20-%20LESSON%2041.mp4?alt=media&token=e65887fc-5c47-4e5e-9722-45c8cce4d1ef", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-24',
            moduleId: 'mod-primary-one',
            title: "Lesson 24: Simple Past Expression: \"I was busy...\"",
            description: "Explain past activities, reasons for delays, and practice basic past tense expressions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20WAS%20BUSY%20-%20LESSON%2040.mp4?alt=media&token=848307cf-1d90-43ce-97b9-321040037aee",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FI%20WAS%20BUSY%20-%20LESSON%2040.mp4?alt=media&token=848307cf-1d90-43ce-97b9-321040037aee", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-25',
            moduleId: 'mod-primary-one',
            title: "Lesson 25: Identity - Self-Introduction & Personal Information",
            description: "Introduce yourself: name, nationality, age, occupation, and hometown with confidence.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FIDENTITY%20-%20LESSON%2026.mp4?alt=media&token=70e96a9d-d6c1-4ae9-b5f7-f45703809a9f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FIDENTITY%20-%20LESSON%2026.mp4?alt=media&token=70e96a9d-d6c1-4ae9-b5f7-f45703809a9f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-26',
            moduleId: 'mod-primary-one',
            title: "Lesson 26: Useful Phrasing: \"It is time to...\"",
            description: "Indicate departure, starting meetings, eating meals, or beginning an activity smoothly.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FIT%20IS%20TIME%20TO%20-%20LESSON%2039.mp4?alt=media&token=75e7f957-5262-49e8-aa24-b4cd36ec250b",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FIT%20IS%20TIME%20TO%20-%20LESSON%2039.mp4?alt=media&token=75e7f957-5262-49e8-aa24-b4cd36ec250b", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-27',
            moduleId: 'mod-primary-one',
            title: "Lesson 27: Short Story & Reading Practice: \"Liz and a Pot\"",
            description: "Beginner reading practice with phonics, comprehension questions, and narrative vocabulary.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FLIZ%20AND%20A%20POT%20%20%20%20%20LESSON%2013.mp4?alt=media&token=ed602122-bc81-4fca-82ff-0fd6ce7ac1ae",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FLIZ%20AND%20A%20POT%20%20%20%20%20LESSON%2013.mp4?alt=media&token=ed602122-bc81-4fca-82ff-0fd6ce7ac1ae", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-28',
            moduleId: 'mod-primary-one',
            title: "Lesson 28: Possessive Pronouns: My, His, Her",
            description: "Practice using my, his, and her correctly to denote possession and describe people.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20-%20HIS%20-%20HER%20-%20LESSON%2033.mp4?alt=media&token=f8738489-4d57-4f70-9955-a56b7c35b9e2",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20-%20HIS%20-%20HER%20-%20LESSON%2033.mp4?alt=media&token=f8738489-4d57-4f70-9955-a56b7c35b9e2", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-29',
            moduleId: 'mod-primary-one',
            title: "Lesson 29: My Body - Deep Dive & Action Verbs",
            description: "Connect body parts to physical senses: seeing with eyes, hearing with ears, and walking.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20BODY%20-%20LESSON%2034.mp4?alt=media&token=013d72c8-8a9b-4a43-90fd-f86ad274e1d4",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20BODY%20-%20LESSON%2034.mp4?alt=media&token=013d72c8-8a9b-4a43-90fd-f86ad274e1d4", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-30',
            moduleId: 'mod-primary-one',
            title: "Lesson 30: My Family - Conversation & Descriptions",
            description: "Conversational roleplay describing family backgrounds, favorite relatives, and home life.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20FAMILY%20%20-LESSON%2038.mp4?alt=media&token=df7f41de-f2a2-4c40-ad3f-c8c0a7086620",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20FAMILY%20%20-LESSON%2038.mp4?alt=media&token=df7f41de-f2a2-4c40-ad3f-c8c0a7086620", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-31',
            moduleId: 'mod-primary-one',
            title: "Lesson 31: My Street - Neighborhood & Places in Town",
            description: "Describe your street, local market, roads, houses, neighbors, and directions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20STREET%20-%20LESSON%2032.mp4?alt=media&token=1a808016-8664-4ec9-afbd-9e2e78d19b16",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FMY%20STREET%20-%20LESSON%2032.mp4?alt=media&token=1a808016-8664-4ec9-afbd-9e2e78d19b16", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-32',
            moduleId: 'mod-primary-one',
            title: "Lesson 32: Possessive Adjectives: Our, Their, Your, Its",
            description: "Complete possessive adjectives covering plural and third person forms with practical examples.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FPOSSESSIVE%20ADJECTIVE%20-%20LESSON%2031.mp4?alt=media&token=2ba1b1fa-cf1d-4642-93a6-4d29b97bae68",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FPOSSESSIVE%20ADJECTIVE%20-%20LESSON%2031.mp4?alt=media&token=2ba1b1fa-cf1d-4642-93a6-4d29b97bae68", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-33',
            moduleId: 'mod-primary-one',
            title: "Lesson 33: The Clothes Shop - Shopping & Asking Prices",
            description: "Shopping dialogues, asking for sizes, inquiring about price, and completing simple transactions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FTHE%20CLOTHES%20SHOP%20-%20LESSON%2048.mp4?alt=media&token=3f3001e0-5167-416d-bd5a-b7dfe2e0afe2",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FTHE%20CLOTHES%20SHOP%20-%20LESSON%2048.mp4?alt=media&token=3f3001e0-5167-416d-bd5a-b7dfe2e0afe2", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-34',
            moduleId: 'mod-primary-one',
            title: "Lesson 34: The Home - Daily Domestic Routines",
            description: "Detailed look at domestic life: cleaning, cooking, resting, and common household chores.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FTHE%20HOME%20-%20LESSON%2027.mp4?alt=media&token=bba783cb-0dc4-46c4-ab33-2390e6941a5e",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FTHE%20HOME%20-%20LESSON%2027.mp4?alt=media&token=bba783cb-0dc4-46c4-ab33-2390e6941a5e", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-35',
            moduleId: 'mod-primary-one',
            title: "Lesson 35: Opposites & Directional Verbs: \"Up and Down\"",
            description: "Master antonyms and directions: up and down, high and low, near and far, open and shut.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FUP%20AND%20DOWN%20%20%20%20%20LESSON%2012%20-%20LESSON%2029.mp4?alt=media&token=11e599ed-397c-49bf-9ff1-476ea852b696",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FUP%20AND%20DOWN%20%20%20%20%20LESSON%2012%20-%20LESSON%2029.mp4?alt=media&token=11e599ed-397c-49bf-9ff1-476ea852b696", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-36',
            moduleId: 'mod-primary-one',
            title: "Lesson 36: Asking Questions: \"What are you doing right now?\"",
            description: "Form questions in the present continuous and have lively beginner conversations.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FWHAT%20ARE%20YOU%20DOING%20RIGHT%20NOW%20-%20LESSON%2030.mp4?alt=media&token=a2b61e33-176f-4590-8a57-eea511554685",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FWHAT%20ARE%20YOU%20DOING%20RIGHT%20NOW%20-%20LESSON%2030.mp4?alt=media&token=a2b61e33-176f-4590-8a57-eea511554685", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-37',
            moduleId: 'mod-primary-one',
            title: "Lesson 37: Telling Time: \"What time is it?\"",
            description: "Ask the time, understand clock expressions (o'clock, half past), and speak about schedules.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FWHAT%20TIME%20IS%20IT%20%20%20%20LESSON%2011.mp4?alt=media&token=0d4d0e0d-a9bf-487a-a074-22f4e4d84480",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FWHAT%20TIME%20IS%20IT%20%20%20%20LESSON%2011.mp4?alt=media&token=0d4d0e0d-a9bf-487a-a074-22f4e4d84480", resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          },
          {
            id: 'beg-lesson-quiz',
            moduleId: 'mod-primary-one',
            title: 'Knowledge Check: English Primary One Foundation Exam',
            description: 'Demonstrate your mastery of beginner English expressions, vocabulary, greetings, possessive adjectives, and daily time concepts.',
            type: 'quiz',
            durationMinutes: 15,
            quiz: {
              id: 'quiz-primary-one',
              title: 'English Primary One Mastery Exam',
              description: 'Assess foundational English (A1-A2) comprehension across all 37 lessons.',
              passingScorePercent: 75,
              questions: [
                {
                  id: 'bq1',
                  question: 'Which of the following is a polite morning greeting in English?',
                  options: [
                    'Good morning, how are you?',
                    'Good night, see you tomorrow',
                    'Good afternoon, go away',
                    'Goodbye forever'
                  ],
                  correctIndex: 0,
                  explanation: '"Good morning, how are you?" is the standard polite greeting when seeing someone in the morning.'
                },
                {
                  id: 'bq2',
                  question: 'Complete the sentence correctly: "Look! The cat is sleeping ______ the table."',
                  options: [
                    'under',
                    'between into',
                    'during',
                    'of'
                  ],
                  correctIndex: 0,
                  explanation: '"Under the table" is a correct preposition of place describing spatial position.'
                },
                {
                  id: 'bq3',
                  question: 'Which pronoun correctly completes this sentence: "This is Sarah. ______ favorite subject is English."',
                  options: [
                    'Her',
                    'His',
                    'Their',
                    'Its'
                  ],
                  correctIndex: 0,
                  explanation: 'We use the possessive adjective "Her" for a female singular person.'
                },
                {
                  id: 'bq4',
                  question: 'What is the correct English phrase to ask the current time?',
                  options: [
                    'What time is it?',
                    'How many clock is now?',
                    'When is the hour?',
                    'Which clock time do you have?'
                  ],
                  correctIndex: 0,
                  explanation: 'The natural question to ask for the time in English is "What time is it?".'
                },
                {
                  id: 'bq5',
                  question: 'Which sentence correctly expresses an ability using the modal verb "can"?',
                  options: [
                    'I can speak English fluently.',
                    'I can to speaking English.',
                    'I canning speak English.',
                    'I can speaks English.'
                  ],
                  correctIndex: 0,
                  explanation: '"Can" is followed by the bare infinitive verb: "I can speak English fluently."'
                }
              ]
            },
            resources: [{"id":"res-beg-note-1","title":"Beginner Words Reference Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FBeginner%20Words.pdf?alt=media&token=4a0f11f9-c5a6-47fd-94eb-260f943c9fe5","type":"pdf","size":"2.4 MB"},{"id":"res-beg-note-2","title":"ENGLISH PRIMARY 1 Course Textbook & Notes (PDF)","url":"https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FENGLISH%20PRIMARY%201.pdf?alt=media&token=6fd3f9f3-db07-41d6-96aa-a17c7318e60e","type":"pdf","size":"4.8 MB"}]
          }
        ]
      },
      {
        id: 'mod-numbers',
        title: 'Numbers',
        description: 'Comprehensive lessons covering single-digit, two-digit, and three-digit numbers, counting by tens, number words, and practical conversational usage, accompanied by official PDF notes.',
        lessons: [
          {
            id: 'beg-num-1',
            moduleId: 'mod-numbers',
            title: 'Lesson 1: Three-Digit Numbers (Lesson 47)',
            description: 'Master reading, writing, and pronouncing three-digit numbers in English with clear pronunciation and usage rules.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2F3%20DIGIT%20NUMBER%20-%20LESSON%2047.mp4?alt=media&token=e09a6f0b-ba76-463f-a281-131c0820d3f1',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2F3%20DIGIT%20NUMBER%20-%20LESSON%2047.mp4?alt=media&token=e09a6f0b-ba76-463f-a281-131c0820d3f1', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            resources: [
              {
                id: 'res-beg-numbers-pdf',
                title: 'Numbers Reference Notes & Study Guide (PDF)',
                url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          },
          {
            id: 'beg-num-2',
            moduleId: 'mod-numbers',
            title: 'Lesson 2: Digit Number Words 20+ by Tens (Lesson 46)',
            description: 'Learn English counting by tens: twenty, thirty, forty, fifty, up to one hundred, with proper word stress and spelling patterns.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FDIGIT%20NUMBER%20WORDS%2020%2B%20BY%20TENS%20-%20LESSON%2046.mp4?alt=media&token=e35807c6-0d33-4a17-9942-50a3610df4fe',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FDIGIT%20NUMBER%20WORDS%2020%2B%20BY%20TENS%20-%20LESSON%2046.mp4?alt=media&token=e35807c6-0d33-4a17-9942-50a3610df4fe', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            resources: [
              {
                id: 'res-beg-numbers-pdf',
                title: 'Numbers Reference Notes & Study Guide (PDF)',
                url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          },
          {
            id: 'beg-num-3',
            moduleId: 'mod-numbers',
            title: 'Lesson 3: Numbers 1 - 20 (Lesson 5)',
            description: 'Foundation numbers from one to twenty, cardinal numbers pronunciation, and common counting exercises in everyday conversation.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS%201%20-%2020%20%20%20%20%20LESSON%205.mp4?alt=media&token=1be5446f-54da-41ec-8b65-0c7d051505a3',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS%201%20-%2020%20%20%20%20%20LESSON%205.mp4?alt=media&token=1be5446f-54da-41ec-8b65-0c7d051505a3', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            resources: [
              {
                id: 'res-beg-numbers-pdf',
                title: 'Numbers Reference Notes & Study Guide (PDF)',
                url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          },
          {
            id: 'beg-num-4',
            moduleId: 'mod-numbers',
            title: 'Lesson 4: Single Digit Numbers 1 - 9 (Lesson 44)',
            description: 'Clear pronunciation, spelling, and spoken drills for single-digit numbers 1 through 9 with practical exercises.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FSINGLE%20DIGIT%20NUMBER%201%20-%209%20-%20LESSON%2044.mp4?alt=media&token=00d88190-e3c0-4b06-bc26-c996d0d2a23a',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FSINGLE%20DIGIT%20NUMBER%201%20-%209%20-%20LESSON%2044.mp4?alt=media&token=00d88190-e3c0-4b06-bc26-c996d0d2a23a', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            resources: [
              {
                id: 'res-beg-numbers-pdf',
                title: 'Numbers Reference Notes & Study Guide (PDF)',
                url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          },
          {
            id: 'beg-num-5',
            moduleId: 'mod-numbers',
            title: 'Lesson 5: Two Digit Numbers 20 - 49 (Lesson 45)',
            description: 'Learn to formulate and vocalize two-digit compound numbers between 20 and 49 with confidence and accurate pronunciation.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FTWO%20DIGIT%20NUMBER%2020%20-%2049%20-%20LESSON%2045.mp4?alt=media&token=93f442da-68f4-4847-b223-7f675d62f9fb',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FTWO%20DIGIT%20NUMBER%2020%20-%2049%20-%20LESSON%2045.mp4?alt=media&token=93f442da-68f4-4847-b223-7f675d62f9fb', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
            resources: [
              {
                id: 'res-beg-numbers-pdf',
                title: 'Numbers Reference Notes & Study Guide (PDF)',
                url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FNumbers%2FNUMBERS.pdf?alt=media&token=21b2c7c1-82a9-4515-84ed-95cd0ed763c9',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-administrative',
        title: 'Administrative',
        description: 'Core administrative and conversational negative constructions and interrogatives: Is This?, Are These?, Those Are Not, That Is Not, and This Is Not.',
        lessons: [
          {
            id: 'beg-admin-1',
            moduleId: 'mod-administrative',
            title: 'Lesson 1: Administrative - Those Are Not (Lesson 8)',
            description: 'Learn to form negative sentences with plural distant objects using "Those are not" with clear sentence structures.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20%20%20%20THOSE%20ARE%20NOT%20%20%20%20%20%20%20%20%20%20LESSON%208.mp4?alt=media&token=7950114d-a491-4924-a1ec-680badc90a6e',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20%20%20%20THOSE%20ARE%20NOT%20%20%20%20%20%20%20%20%20%20LESSON%208.mp4?alt=media&token=7950114d-a491-4924-a1ec-680badc90a6e', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-2',
            moduleId: 'mod-administrative',
            title: 'Lesson 2: Administrative - Are These? (Lesson 13)',
            description: 'Asking plural questions with proximate items: "Are these your books?", with affirmative and negative responses.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20ARE%20THESE%20%20%20%20%20%20LESSON%2013.mp4?alt=media&token=17cb2d7d-9fe7-46fb-af7b-cf3c64e8a12a',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20ARE%20THESE%20%20%20%20%20%20LESSON%2013.mp4?alt=media&token=17cb2d7d-9fe7-46fb-af7b-cf3c64e8a12a', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-3',
            moduleId: 'mod-administrative',
            title: 'Lesson 3: Administrative - Is That? (Lesson 16)',
            description: 'Asking singular questions pointing to distant objects using "Is that...?" with natural short and complete answers.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20IS%20THAT%20-%20LESSON%2016.mp4?alt=media&token=d519515d-83d0-4178-8805-a3b3e01ca217',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20IS%20THAT%20-%20LESSON%2016.mp4?alt=media&token=d519515d-83d0-4178-8805-a3b3e01ca217', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-4',
            moduleId: 'mod-administrative',
            title: 'Lesson 4: Administrative - Is This? (Lesson 24)',
            description: 'Formulating polite questions for nearby singular items with "Is this...?", master intonation patterns and replies.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20IS%20THIS%20-%20%20%20LESSON%2024.mp4?alt=media&token=559da459-2d64-4847-b803-5b66a23641c5',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20IS%20THIS%20-%20%20%20LESSON%2024.mp4?alt=media&token=559da459-2d64-4847-b803-5b66a23641c5', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-5',
            moduleId: 'mod-administrative',
            title: 'Lesson 5: Administrative - That Is Not (Lesson 14)',
            description: 'Expressing singular negative identification of distant objects: "That is not mine", contractions and common usage.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THAT%20IS%20NOT%20-%20LESSON%2014.mp4?alt=media&token=5bbfd362-6dde-4b2e-9683-5ddbf7449e1c',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THAT%20IS%20NOT%20-%20LESSON%2014.mp4?alt=media&token=5bbfd362-6dde-4b2e-9683-5ddbf7449e1c', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-6',
            moduleId: 'mod-administrative',
            title: 'Lesson 6: Administrative - These Are Not (Lesson 25)',
            description: 'Constructing plural negative statements with proximate objects using "These are not" with everyday objects.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THESE%20ARE%20NOT%20-%20LESSON%2025.mp4?alt=media&token=80945e7e-2cb7-4060-9c15-404173d46632',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THESE%20ARE%20NOT%20-%20LESSON%2025.mp4?alt=media&token=80945e7e-2cb7-4060-9c15-404173d46632', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'beg-admin-7',
            moduleId: 'mod-administrative',
            title: 'Lesson 7: Administrative - This Is Not (Lesson 15)',
            description: 'Forming singular negative statements with nearby items using "This is not" with common noun collocations.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THIS%20IS%20NOT%20-%20LESSON%2015.mp4?alt=media&token=24e179ba-1a39-48d8-9626-6d852c7794d5',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FAdministrative%2FADMINISTRATIVE%20-%20THIS%20IS%20NOT%20-%20LESSON%2015.mp4?alt=media&token=24e179ba-1a39-48d8-9626-6d852c7794d5', resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mod-demonstrative',
        title: 'Demonstrative',
        description: 'Master English demonstrative pronouns and determiners (This, That, These, Those) in positive statements, questions, and negative forms.',
        lessons: [
          {
            id: 'beg-dem-1',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 1: Demonstrative - These (Lesson 3)',
            description: 'Using the plural demonstrative "These" to identify, describe, and introduce people and multiple objects close by.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDEMONSTRATIVE%20THESE%20-%20%20%20%20%20%20%20%20%20%20%20%20LESSON%203.mp4?alt=media&token=e22baf23-6bf8-44c8-8ccf-4fb73f380f39',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDEMONSTRATIVE%20THESE%20-%20%20%20%20%20%20%20%20%20%20%20%20LESSON%203.mp4?alt=media&token=e22baf23-6bf8-44c8-8ccf-4fb73f380f39', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'beg-dem-2',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 2: Demonstrative - This (Lesson 2)',
            description: 'Using the singular demonstrative "This" for nearby singular items, introducing oneself, and pointing to direct references.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDEMONSTRATIVE%20THIS%20-%20%20%20%20%20%20%20%20LESSON%202.mp4?alt=media&token=0fccbaa0-336e-413b-b039-d10776272f55',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDEMONSTRATIVE%20THIS%20-%20%20%20%20%20%20%20%20LESSON%202.mp4?alt=media&token=0fccbaa0-336e-413b-b039-d10776272f55', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'beg-dem-3',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 3: Demonstrative - Is This? (Lesson 6)',
            description: 'Practice asking "Is this...?" with rising intonation, clarifying ownership, and confirming identities.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20%20-%20Is%20this%20%20%20%20%20%20%20%20%20%20%20LESSON%206.mp4?alt=media&token=5de55947-20de-4879-842a-c3a0cc94ea59',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20%20-%20Is%20this%20%20%20%20%20%20%20%20%20%20%20LESSON%206.mp4?alt=media&token=5de55947-20de-4879-842a-c3a0cc94ea59', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'beg-dem-4',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 4: Demonstrative - Is That? (Lesson 7)',
            description: 'Practice asking "Is that...?" when referring to distant objects, locations, and distant situations.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20Is%20that%20%20%20%20%20%20%20%20%20%20%20%20LESSON%207.mp4?alt=media&token=3b66ce86-a939-48c9-97ac-9c317f4e5d27',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20Is%20that%20%20%20%20%20%20%20%20%20%20%20%20LESSON%207.mp4?alt=media&token=3b66ce86-a939-48c9-97ac-9c317f4e5d27', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'beg-dem-5',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 5: Demonstrative - That Is Not (Lesson 5)',
            description: 'Clear instruction on stating negative assertions with distant objects using "That is not" in conversation.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20That%20is%20not%20%20%20%20%20%20%20%20%20LESSON%205.mp4?alt=media&token=0f1b3baa-1b8a-452f-bb1e-b9bcbb71a28e',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20That%20is%20not%20%20%20%20%20%20%20%20%20LESSON%205.mp4?alt=media&token=0f1b3baa-1b8a-452f-bb1e-b9bcbb71a28e', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'beg-dem-6',
            moduleId: 'mod-demonstrative',
            title: 'Lesson 6: Demonstrative - This Is Not (Lesson 4)',
            description: 'Master expressing negative assertions for objects at hand using "This is not" with proper cadence and rhythm.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20This%20is%20not%20-%20%20%20%20%20%20%20%20LESSON%204.mp4?alt=media&token=cbedecbb-fd01-459d-a5ae-0d9ae20d79c0',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FDemonstrative%2FDemonstrative%20-%20This%20is%20not%20-%20%20%20%20%20%20%20%20LESSON%204.mp4?alt=media&token=cbedecbb-fd01-459d-a5ae-0d9ae20d79c0', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          }
        ]
      }
    ]
  },
  {
    id: 'course-english-for-beginners',
    title: 'English Intermediate Level (B1 - B2)',
    subtitle: 'Master Intermediate English, Expansive Vocabularies & Conversational Fluency (B1 - B2)',
    description: 'A comprehensive B1–B2 intermediate English course designed to elevate your fluency and linguistic precision. Features 2 complete modules: "Vocabularies" (27 lessons & quiz) and "Sentence Daily Use" (23 practical video lessons) covering conversational words, collocations, pronunciation, and real-life everyday sentence structures.',
    category: 'Intermediate English',
    level: 'Intermediate',
    instructor: {
      name: 'Abdifatah Jama',
      role: 'Lead English Language Educator',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
      bio: 'Experienced English language educator specializing in practical vocabulary, pronunciation, conversational fluency, and ESL instruction.'
    },
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c',
    estimatedHours: 14,
    updatedAt: '2026-09-25',
    tags: ['English Intermediate Level (B1 - B2)', 'Intermediate English', 'B1-B2', 'Vocabularies', 'Sentence Daily Use', 'Vocabulary', 'Pronunciation', 'Speaking', 'ESL', 'Conversation'],
    price: 25,
    originalPrice: 50,
    discountPercent: 50,
    totalLessonsCount: 51,
    modules: [
      {
        id: 'mod-vocab-1',
        title: 'Vocabularies (Lessons 1–27)',
        description: 'Complete 27-part video lesson series mastering essential English vocabularies, high-frequency conversational words, collocations, and pronunciation drills, followed by a comprehensive knowledge check.',
        lessons: [
          {
            id: 'vocab-lesson-1',
            moduleId: 'mod-vocab-1',
            title: "Lesson 1: Essential English Vocabulary & Everyday Words",
            description: "Build a solid foundation with high-frequency everyday English vocabulary, accurate pronunciation models, and practical real-life usage examples.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%201.mp4?alt=media&token=5ab2bd4f-8f01-44d7-b146-63d86e9d6e6f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%201.mp4?alt=media&token=5ab2bd4f-8f01-44d7-b146-63d86e9d6e6f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v1', title: 'Lesson 1 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-2',
            moduleId: 'mod-vocab-1',
            title: "Lesson 2: Daily Conversation & Contextual Words",
            description: "Learn dynamic vocabulary words and phrases for conversational social interactions, daily routines, and casual dialogue.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%202.mp4?alt=media&token=5c196e45-f776-43ef-be6a-75843c13de1e",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%202.mp4?alt=media&token=5c196e45-f776-43ef-be6a-75843c13de1e", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v2', title: 'Lesson 2 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-3',
            moduleId: 'mod-vocab-1',
            title: "Lesson 3: Practical Vocabulary in Sentences",
            description: "Put new words into practice with real sentence examples, learning natural syntax, tone, and appropriate register.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%203.mp4?alt=media&token=f46c8117-8e95-47a1-8917-7d24dac6b71b",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%203.mp4?alt=media&token=f46c8117-8e95-47a1-8917-7d24dac6b71b", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v3', title: 'Lesson 3 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-4',
            moduleId: 'mod-vocab-1',
            title: "Lesson 4: Expanding Core Vocabulary & Descriptive Expressions",
            description: "Broaden your descriptive capability with adjectives, descriptive adverbs, and emotive vocabulary for richer expression.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%204.mp4?alt=media&token=3aa36125-c099-480f-9564-9628abf7847f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%204.mp4?alt=media&token=3aa36125-c099-480f-9564-9628abf7847f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v4', title: 'Lesson 4 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-5',
            moduleId: 'mod-vocab-1',
            title: "Lesson 5: Collocations & Common Natural Phrasing",
            description: "Learn native-like collocations and high-frequency word pairings to make your spoken English sound effortless and authentic.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%205.mp4?alt=media&token=05d8e087-bbdf-406f-bf71-7d89279a3be6",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%205.mp4?alt=media&token=05d8e087-bbdf-406f-bf71-7d89279a3be6", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v5', title: 'Lesson 5 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-6',
            moduleId: 'mod-vocab-1',
            title: "Lesson 6: Advanced Word Usage & Fluency Practice",
            description: "Refine your vocabulary with subtle nuances, precise synonyms, antonyms, and fluency enhancement strategies.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%206.mp4?alt=media&token=915d208f-3de1-48da-b4bd-4309ef62cb1f",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%206.mp4?alt=media&token=915d208f-3de1-48da-b4bd-4309ef62cb1f", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v6', title: 'Lesson 6 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-7',
            moduleId: 'mod-vocab-1',
            title: "Lesson 7: Mastery, Review & Real-World Application",
            description: "Synthesize everything learned across the course with speaking prompts, vocabulary consolidation, and real-world conversational drills.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%207.mp4?alt=media&token=6f2ec880-48ce-4905-a3b0-5a7f57556990",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%207.mp4?alt=media&token=6f2ec880-48ce-4905-a3b0-5a7f57556990", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v7', title: 'Lesson 7 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-8',
            moduleId: 'mod-vocab-1',
            title: "Lesson 8: Everyday Travel & Directions Vocabulary",
            description: "Essential English terms, questions, and polite phrases for navigating airports, asking directions, hotels, and transit.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%208.mp4?alt=media&token=fa919bea-8c55-4bab-ad64-eca6817d318a",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%208.mp4?alt=media&token=fa919bea-8c55-4bab-ad64-eca6817d318a", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v8', title: 'Lesson 8 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-9',
            moduleId: 'mod-vocab-1',
            title: "Lesson 9: Workplace & Professional Communication Vocabulary",
            description: "Professional vocabulary for meetings, email communication, workplace collaboration, and confident presentations.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%209.mp4?alt=media&token=e3fb8c4f-ba14-412b-9cf0-835fd17d9112",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%209.mp4?alt=media&token=e3fb8c4f-ba14-412b-9cf0-835fd17d9112", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v9', title: 'Lesson 9 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-10',
            moduleId: 'mod-vocab-1',
            title: "Lesson 10: Social Interactions & Networking Phrasing",
            description: "Master small talk, building rapport, introductions, active listening responses, and conversational icebreakers.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2010.mp4?alt=media&token=53f5e5d2-6b2b-43de-8a6f-7c2e23fd8c75",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2010.mp4?alt=media&token=53f5e5d2-6b2b-43de-8a6f-7c2e23fd8c75", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v10', title: 'Lesson 10 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-11',
            moduleId: 'mod-vocab-1',
            title: "Lesson 11: Food, Dining & Hospitality Vocabulary",
            description: "Vocabulary for restaurants, ordering food, dietary preferences, cooking verbs, flavors, and dining etiquette.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2011.mp4?alt=media&token=33b1fc90-da68-4603-b2d0-d0cee0f466a2",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2011.mp4?alt=media&token=33b1fc90-da68-4603-b2d0-d0cee0f466a2", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v11', title: 'Lesson 11 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-12',
            moduleId: 'mod-vocab-1',
            title: "Lesson 12: Health, Wellness & Medical Expressions",
            description: "Communicate symptoms, speak with doctors, describe health states, medications, and general physical wellbeing.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2012.mp4?alt=media&token=def2c11d-3413-41cb-98f2-a6c296d71174",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2012.mp4?alt=media&token=def2c11d-3413-41cb-98f2-a6c296d71174", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v12', title: 'Lesson 12 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-13',
            moduleId: 'mod-vocab-1',
            title: "Lesson 13: Shopping, Money & Commerce Vocabulary",
            description: "Vocabulary for prices, discounts, payments, bargaining, customer service inquiries, and e-commerce phrases.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2013.mp4?alt=media&token=332d2802-f1e6-4185-8472-5861910b6484",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2013.mp4?alt=media&token=332d2802-f1e6-4185-8472-5861910b6484", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v13', title: 'Lesson 13 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-14',
            moduleId: 'mod-vocab-1',
            title: "Lesson 14: Emotions, Feelings & Psychological Terms",
            description: "Accurately articulate emotional states, mood variations, empathy, reactions, and psychological expressions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2014.mp4?alt=media&token=8942f1f5-25b2-43ef-8178-f6f0960987df",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2014.mp4?alt=media&token=8942f1f5-25b2-43ef-8178-f6f0960987df", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v14', title: 'Lesson 14 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-15',
            moduleId: 'mod-vocab-1',
            title: "Lesson 15: Time, Scheduling & Calendar Idioms",
            description: "Time management vocabulary, deadlines, frequency adverbs, appointments, and common English idioms relating to time.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2015.mp4?alt=media&token=906fa465-26bf-4117-b691-56c8833f0bcd",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2015.mp4?alt=media&token=906fa465-26bf-4117-b691-56c8833f0bcd", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v15', title: 'Lesson 15 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-16',
            moduleId: 'mod-vocab-1',
            title: "Lesson 16: Family, Relationships & Social Bonds",
            description: "Describe family trees, relationship dynamics, friendship idioms, personality traits, and social ties.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2016.mp4?alt=media&token=4f77deac-d34b-4569-8cc9-07b90581adf5",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2016.mp4?alt=media&token=4f77deac-d34b-4569-8cc9-07b90581adf5", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v16', title: 'Lesson 16 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-17',
            moduleId: 'mod-vocab-1',
            title: "Lesson 17: Education, Studies & Academic Terms",
            description: "Vocabulary for school, university, research, assignments, exams, graduation, and formal academic discussions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2017.mp4?alt=media&token=d6de83b7-8684-49ce-aecc-c5ddfb005aab",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2017.mp4?alt=media&token=d6de83b7-8684-49ce-aecc-c5ddfb005aab", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v17', title: 'Lesson 17 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-18',
            moduleId: 'mod-vocab-1',
            title: "Lesson 18: Technology, Media & Digital Terms",
            description: "Modern vocabulary for smartphones, applications, software, internet culture, social media, and digital trends.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2018.mp4?alt=media&token=e184bb19-b288-4268-8db5-58cf09d33f18",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2018.mp4?alt=media&token=e184bb19-b288-4268-8db5-58cf09d33f18", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v18', title: 'Lesson 18 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-19',
            moduleId: 'mod-vocab-1',
            title: "Lesson 19: Weather, Nature & Environment Words",
            description: "Discuss forecasts, climate patterns, geographical landmarks, natural phenomena, and environmental preservation.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2019.mp4?alt=media&token=99409548-ef2f-4e5d-9a70-3afd9f175094",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2019.mp4?alt=media&token=99409548-ef2f-4e5d-9a70-3afd9f175094", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v19', title: 'Lesson 19 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-20',
            moduleId: 'mod-vocab-1',
            title: "Lesson 20: Hobbies, Sports & Leisure Vocabulary",
            description: "Express your passions, leisure activities, sports rules, creative arts, and entertainment preferences.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2020.mp4?alt=media&token=008db74c-d3db-4d9f-8011-613be8fe2ae5",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2020.mp4?alt=media&token=008db74c-d3db-4d9f-8011-613be8fe2ae5", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v20', title: 'Lesson 20 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-21',
            moduleId: 'mod-vocab-1',
            title: "Lesson 21: Idiomatic Expressions & Common Slang",
            description: "Unlock colorful figures of speech, colloquial idioms, and everyday slang to understand native speakers with ease.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2021.mp4?alt=media&token=738729aa-220e-45a5-b672-180d3bd6d6de",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2021.mp4?alt=media&token=738729aa-220e-45a5-b672-180d3bd6d6de", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v21', title: 'Lesson 21 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-22',
            moduleId: 'mod-vocab-1',
            title: "Lesson 22: Phrasal Verbs & Action Collocations",
            description: "High-frequency phrasal verbs with multiple meanings (take off, get along, bring up, look into) demystified with examples.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2022.mp4?alt=media&token=30845a0c-d62f-49db-863c-30346a174297",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2022.mp4?alt=media&token=30845a0c-d62f-49db-863c-30346a174297", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v22', title: 'Lesson 22 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-23',
            moduleId: 'mod-vocab-1',
            title: "Lesson 23: Formal vs. Informal Language Shifts",
            description: "Learn how to transition seamlessly between casual conversation and professional, courteous formal English.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2023.mp4?alt=media&token=f6977dcf-135c-4cbd-98ac-a2e4232c2453",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2023.mp4?alt=media&token=f6977dcf-135c-4cbd-98ac-a2e4232c2453", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v23', title: 'Lesson 23 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-24',
            moduleId: 'mod-vocab-1',
            title: "Lesson 24: Debating, Agreeing & Disagreeing Naturally",
            description: "Persuasive vocabulary, respectful counter-arguments, hedging language, and polite disagreement expressions.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2024.mp4?alt=media&token=9647f4fb-d776-4594-a735-d0089e51c871",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2024.mp4?alt=media&token=9647f4fb-d776-4594-a735-d0089e51c871", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v24', title: 'Lesson 24 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-25',
            moduleId: 'mod-vocab-1',
            title: "Lesson 25: Storytelling, Narrative & Sequencing Connectors",
            description: "Link your ideas logically with discourse markers, transition words, narrative hooks, and captivating storytelling vocabulary.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2025.mp4?alt=media&token=c8012c12-a11c-46f5-bee5-d471c4dc05e9",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2025.mp4?alt=media&token=c8012c12-a11c-46f5-bee5-d471c4dc05e9", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v25', title: 'Lesson 25 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-26',
            moduleId: 'mod-vocab-1',
            title: "Lesson 26: Complex Nuances & Precision Word Choice",
            description: "Distinguish between near-synonyms, eliminate repetitive word usage, and express subtle differences in thought.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2026.mp4?alt=media&token=c6f7a16b-ed65-4689-8559-fabf689778d1",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2026.mp4?alt=media&token=c6f7a16b-ed65-4689-8559-fabf689778d1", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v26', title: 'Lesson 26 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-27',
            moduleId: 'mod-vocab-1',
            title: "Lesson 27: Final Comprehensive Vocabulary Capstone",
            description: "The complete course capstone: active recall drills, real-world speaking prompts, and fluency evaluation.",
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2027.mp4?alt=media&token=fcf60874-7e58-492d-9c04-3d0dd4d36763",
            videoSources: [
              { label: 'Full HD 1080p', url: "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FVOCABULARIES%20-%20LESSON%2027.mp4?alt=media&token=fcf60874-7e58-492d-9c04-3d0dd4d36763", resolution: '1080p' }
            ],
            videoThumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
            resources: [
              { id: 'res-v27', title: 'Lesson 27 Vocabulary Reference Sheet (PDF)', url: '#', type: 'pdf', size: '1.2 MB' }
            ]
          },
          {
            id: 'vocab-lesson-quiz',
            moduleId: 'mod-vocab-1',
            title: 'Knowledge Check: Vocabularies Retention & Mastery Exam',
            description: 'Assess your comprehension of key vocabulary words, definitions, collocations, and contextual usage covered across all 27 lessons.',
            type: 'quiz',
            durationMinutes: 15,
            quiz: {
              id: 'quiz-vocab-1',
              title: 'Vocabularies Mastery Exam',
              description: 'Demonstrate your understanding of core English vocabulary, collocations, and natural usage.',
              passingScorePercent: 75,
              questions: [
                {
                  id: 'vq1',
                  question: 'What is a "collocation" in the English language?',
                  options: [
                    'A type of punctuation mark used in formal writing',
                    'Two or more words that naturally and frequently occur together',
                    'A word that has contradictory definitions',
                    'A verb form used only in past tense'
                  ],
                  correctIndex: 1,
                  explanation: 'Collocations are habitual word combinations that sound natural to native speakers (e.g., "make a decision", "heavy traffic", "pay attention").'
                },
                {
                  id: 'vq2',
                  question: 'Which of the following is the most natural, correct collocation with "decision"?',
                  options: [
                    'Do a decision',
                    'Make a decision',
                    'Create a decision',
                    'Build a decision'
                  ],
                  correctIndex: 1,
                  explanation: 'In natural English, native speakers say "make a decision", never "do a decision".'
                },
                {
                  id: 'vq3',
                  question: 'Which word is the closest synonym to "crucial"?',
                  options: [
                    'Essential',
                    'Optional',
                    'Delayed',
                    'Trivial'
                  ],
                  correctIndex: 0,
                  explanation: '"Crucial" means extremely important or essential.'
                },
                {
                  id: 'vq4',
                  question: 'Why is learning new vocabulary in complete sentences and context more effective than studying isolated word lists?',
                  options: [
                    'Because individual words are always incorrect',
                    'Because context shows how the word interacts with prepositions, collocations, and natural grammatical structure',
                    'Because sentence lists are always shorter',
                    'Because dictionaries do not contain isolated words'
                  ],
                  correctIndex: 1,
                  explanation: 'Contextual learning teaches you how to actively produce the word with correct prepositions, tone, and grammar.'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-sentence-daily-use',
        title: 'Sentence Daily Use',
        description: 'Comprehensive 23-part video lesson series mastering essential English sentences for everyday conversations, practical routines, questions, and natural conversational dialogue.',
        lessons: [
          {
            id: 'sdu-lesson-1',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 1: Introduction to Daily English Sentences & Common Phrases',
            description: 'Foundational expressions and everyday sentence patterns for beginning and intermediate daily conversation.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2Flv_0_20240701073652.mp4?alt=media&token=440ecfa6-c7b2-4899-819d-35a9f6081926',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2Flv_0_20240701073652.mp4?alt=media&token=440ecfa6-c7b2-4899-819d-35a9f6081926', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-2',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 2: Sentence Daily Use - Part 1',
            description: 'Essential daily sentence structures and high-frequency expressions for practical conversational situations.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%201.mp4?alt=media&token=fbd91d4c-4800-401e-a943-c30a542add22',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%201.mp4?alt=media&token=fbd91d4c-4800-401e-a943-c30a542add22', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-3',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 3: Sentence Daily Use - Part 2',
            description: 'Everyday communication phrases, natural responses, and conversational questions.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%202.mp4?alt=media&token=947dc6a3-15cc-4b1d-b33c-0a1bfbe00738',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%202.mp4?alt=media&token=947dc6a3-15cc-4b1d-b33c-0a1bfbe00738', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-4',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 4: Sentence Daily Use - Part 3',
            description: 'Practical sentence patterns for home, routines, and daily activities.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%203.mp4?alt=media&token=814393a0-a96a-4cc0-8727-b2c137fc8237',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%203.mp4?alt=media&token=814393a0-a96a-4cc0-8727-b2c137fc8237', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-5',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 5: Sentence Daily Use - Part 4',
            description: 'Fluent sentence construction for asking questions, making requests, and giving directions.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%204.mp4?alt=media&token=11e2d92a-59e5-4a89-a706-b2e953f52775',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%204.mp4?alt=media&token=11e2d92a-59e5-4a89-a706-b2e953f52775', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-6',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 6: Sentence Daily Use - Part 5',
            description: 'Natural expressions for social greetings, sharing opinions, and everyday interactions.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%205.mp4?alt=media&token=733cff72-78ba-490f-8fc5-998930cf3958',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%205.mp4?alt=media&token=733cff72-78ba-490f-8fc5-998930cf3958', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-7',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 7: Sentence Daily Use - Part 6',
            description: 'Expressing feelings, plans, and daily schedules with clarity and confidence.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%206.mp4?alt=media&token=40e5902b-a05c-4ebd-a9bd-2c8f1648bdd2',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%206.mp4?alt=media&token=40e5902b-a05c-4ebd-a9bd-2c8f1648bdd2', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-8',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 8: Sentence Daily Use - Part 7',
            description: 'Real-world dialogue phrases for shopping, dining, and navigating city environments.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%207.mp4?alt=media&token=d8a1d71e-8374-4bb0-86e9-46cd50268110',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%207.mp4?alt=media&token=d8a1d71e-8374-4bb0-86e9-46cd50268110', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-9',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 9: Sentence Daily Use - Part 8',
            description: 'Everyday workplace and study sentences for collaborative communication.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%208.mp4?alt=media&token=13f92102-28bb-4fe4-9b17-4f582febbca1',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%208.mp4?alt=media&token=13f92102-28bb-4fe4-9b17-4f582febbca1', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-10',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 10: Sentence Daily Use - Part 9',
            description: 'Forming polite questions, clarifications, and active listening phrases.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%209.mp4?alt=media&token=458a0f49-097a-4c8b-ac7f-1673598c8529',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%209.mp4?alt=media&token=458a0f49-097a-4c8b-ac7f-1673598c8529', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-11',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 11: Sentence Daily Use - Part 10',
            description: 'Connecting sentences naturally with conjunctions and conversational transitions.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2010.mp4?alt=media&token=c9fcfbdb-7f28-4293-a597-f196efc99c9e',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2010.mp4?alt=media&token=c9fcfbdb-7f28-4293-a597-f196efc99c9e', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-12',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 12: Sentence Daily Use - Part 11',
            description: 'Practical sentence drills for describing problems, solutions, and daily events.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2011.mp4?alt=media&token=b7cc21e0-dff1-4c0f-b806-042ebee8f212',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2011.mp4?alt=media&token=b7cc21e0-dff1-4c0f-b806-042ebee8f212', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-13',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 13: Sentence Daily Use - Part 12',
            description: 'Sentence patterns for giving suggestions, advice, and recommendations politely.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2012.mp4?alt=media&token=b0f48ce0-1d88-40d2-b73b-ab73da6ca9c9',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2012.mp4?alt=media&token=b0f48ce0-1d88-40d2-b73b-ab73da6ca9c9', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-14',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 14: Sentence Daily Use - Part 13',
            description: 'Telephone conversations, appointment booking, and message delivery sentences.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2013.mp4?alt=media&token=3410e4ee-1d19-4e96-8dba-df0f94ec2cee',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2013.mp4?alt=media&token=3410e4ee-1d19-4e96-8dba-df0f94ec2cee', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-15',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 15: Sentence Daily Use - Part 14',
            description: 'Describing past events, personal experiences, and recent occurrences smoothly.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2014.mp4?alt=media&token=b8bd6da6-0be5-4041-a70c-da08af0c6074',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2014.mp4?alt=media&token=b8bd6da6-0be5-4041-a70c-da08af0c6074', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-16',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 16: Sentence Daily Use - Part 15',
            description: 'Expressing certainty, possibility, and future intentions with modal verbs in sentences.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2015.mp4?alt=media&token=cd4ba44f-5eab-4d3e-802a-d8c3956baf71',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2015.mp4?alt=media&token=cd4ba44f-5eab-4d3e-802a-d8c3956baf71', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-17',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 17: Sentence Daily Use - Part 16',
            description: 'Everyday idioms and colloquial sentences commonly used by native English speakers.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2016.mp4?alt=media&token=12b57e61-f048-45c8-9373-ba0be3ebb09e',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2016.mp4?alt=media&token=12b57e61-f048-45c8-9373-ba0be3ebb09e', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-18',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 18: Sentence Daily Use - Part 18',
            description: 'Nuanced conversational sentences for agreeing, disagreeing, and adding thoughts constructively.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2018.mp4?alt=media&token=3ac2e4ad-1f47-46dd-8479-29b974c47a3c',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2018.mp4?alt=media&token=3ac2e4ad-1f47-46dd-8479-29b974c47a3c', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-19',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 19: Sentence Daily Use - Part 19',
            description: 'Social gathering sentences, welcoming guests, and small talk fluency drills.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2019.mp4?alt=media&token=3ddf0998-03bb-4b99-9ee3-9e39715d4f91',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2019.mp4?alt=media&token=3ddf0998-03bb-4b99-9ee3-9e39715d4f91', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-20',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 20: Sentence Daily Use - Part 20',
            description: 'Everyday health, wellness, and medical visit sentence expressions.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2020.mp4?alt=media&token=080cebc5-c721-4913-81fc-11d68ac36ba1',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2020.mp4?alt=media&token=080cebc5-c721-4913-81fc-11d68ac36ba1', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-21',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 21: Sentence Daily Use - Part 21',
            description: 'Travel, transportation, and navigation sentences for commuting and trips.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2021.mp4?alt=media&token=23c46665-17b6-4ee5-8534-537ee8ad2fb8',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2021.mp4?alt=media&token=23c46665-17b6-4ee5-8534-537ee8ad2fb8', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-22',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 22: Sentence Daily Use - Part 22',
            description: 'Polite problem-solving, returning items, and handling customer service inquiries.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2022.mp4?alt=media&token=b7eef984-4e5a-403b-ab3b-c1a1a2175a5a',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2022.mp4?alt=media&token=b7eef984-4e5a-403b-ab3b-c1a1a2175a5a', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          },
          {
            id: 'sdu-lesson-23',
            moduleId: 'mod-sentence-daily-use',
            title: 'Lesson 23: Sentence Daily Use - Part 23',
            description: 'Comprehensive review of practical daily sentences, rapid speech drills, and conversational mastery.',
            type: 'video',
            durationMinutes: 12,
            durationSeconds: 720,
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2023.mp4?alt=media&token=6b445c4f-ba52-4a34-a022-99f142a2e32d',
            videoSources: [
              { label: 'Full HD 1080p', url: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Courses%2FBeginner%2FSentence%20Daily%20Use%2FSENTENCE%20DAILY%20USE%20-%2023.mp4?alt=media&token=6b445c4f-ba52-4a34-a022-99f142a2e32d', resolution: '1080p' }
            ],
            videoThumbnail: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F2.png?alt=media&token=71e51679-92f7-4bed-beb3-5fe7f6daa51c'
          }
        ]
      }
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'student-english-learner',
  name: 'Alex Chen',
  email: 'alex.chen@lafole.net',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  enrolledDate: '2026-09-01',
  learningStreakDays: 5,
  badges: [
    {
      id: 'badge-first-lesson',
      title: 'First Step Master',
      description: 'Completed your first automated video lesson tracking milestone.',
      iconName: 'PlayCircle',
      unlockedAt: '2026-09-02'
    },
    {
      id: 'badge-quiz-ace',
      title: 'Vocabulary Ace',
      description: 'Passed the Vocabularies course knowledge check with an 80%+ score.',
      iconName: 'Award',
      unlockedAt: '2026-09-04'
    },
    {
      id: 'badge-momentum',
      title: 'Consistent Learner',
      description: 'Maintained a 5-day consecutive active learning streak.',
      iconName: 'Zap',
      unlockedAt: '2026-09-06'
    }
  ]
};

export const INITIAL_COHORT_DATA: CohortStudentProgress[] = [
  {
    id: 's-1',
    name: 'Alex Chen (You)',
    email: 'alex.chen@lafole.net',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-english-beginners-a1-a2',
    progressPercent: 42,
    completedLessons: 24,
    totalLessons: 56,
    timeSpentHours: 6.5,
    averageQuizScore: 92,
    lastActive: '12 minutes ago',
    status: 'active'
  },
  {
    id: 's-2',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@lafole.net',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-english-beginners-a1-a2',
    progressPercent: 100,
    completedLessons: 56,
    totalLessons: 56,
    timeSpentHours: 13.8,
    averageQuizScore: 96,
    lastActive: '1 hour ago',
    status: 'completed'
  },
  {
    id: 's-3',
    name: 'Kavita Patel',
    email: 'kavita.p@lafole.net',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-english-beginners-a1-a2',
    progressPercent: 84,
    completedLessons: 47,
    totalLessons: 56,
    timeSpentHours: 11.4,
    averageQuizScore: 88,
    lastActive: '3 hours ago',
    status: 'active'
  },
  {
    id: 's-4',
    name: 'Marcus Brody',
    email: 'm.brody@lafole.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-english-for-beginners',
    progressPercent: 39,
    completedLessons: 20,
    totalLessons: 51,
    timeSpentHours: 5.5,
    averageQuizScore: 75,
    lastActive: '2 days ago',
    status: 'behind'
  },
  {
    id: 's-5',
    name: 'Devon Zhao',
    email: 'dzhao@lafole.net',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-english-for-beginners',
    progressPercent: 100,
    completedLessons: 51,
    totalLessons: 51,
    timeSpentHours: 8.5,
    averageQuizScore: 100,
    lastActive: 'Yesterday',
    status: 'completed'
  }
];
