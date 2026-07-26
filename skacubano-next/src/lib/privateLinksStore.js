import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'privateLinks.json');

export function getPrivateLinksData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading privateLinks.json:', error);
  }
  return { links: [] };
}

export function savePrivateLinksData(data) {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving privateLinks.json:', error);
    return false;
  }
}
