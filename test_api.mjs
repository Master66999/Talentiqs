import fs from 'fs';
import path from 'path';

const filePath = path.resolve('test_resume.pdf');
const fileBuffer = fs.readFileSync(filePath);
const fileName = 'test_resume.pdf';

// Build multipart/form-data manually
const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
const CRLF = '\r\n';

const header = [
  `--${boundary}`,
  `Content-Disposition: form-data; name="resume"; filename="${fileName}"`,
  `Content-Type: application/pdf`,
  '',
  ''
].join(CRLF);

const footer = `${CRLF}--${boundary}--${CRLF}`;

const body = Buffer.concat([
  Buffer.from(header, 'utf8'),
  fileBuffer,
  Buffer.from(footer, 'utf8')
]);

const response = await fetch('http://localhost:5000/api/analyze-resume', {
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length
  },
  body
});

const result = await response.json();

if (!response.ok) {
  console.error('❌ Error from server:', result.error);
  process.exit(1);
}

console.log('✅ SUCCESS! Analysis result:\n');
if (result.keyPoints) {
  console.log('Extracted Key Points:');
  console.log(JSON.stringify(result.keyPoints, null, 2));
}

console.log(`\nMatched ${result.totalScored} out of ${result.totalFound} jobs in DB.`);

for (const match of result.matchedJobs || []) {
  console.log(`\n📌 Job: ${match.title} @ ${match.company}`);
  console.log(`   Match Score: ${match.matchScore}%`);
  console.log(`   Relevance Reasons:`, match.relevanceReasons?.join(', '));
  console.log(`   Missing Skills:`, match.missingSkills?.join(', '));
  console.log(`   Tips:`, match.tips?.join(', '));
}
