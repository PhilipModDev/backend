import cron from 'node-cron';
import { supabase } from './Supabase.js';

cron.schedule('*/5 * * * *', async () => {
    console.log('Running storage cleanup...');
    const { data: files } = await supabase.storage.from('Brickyard-Images').list();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oldFiles = files.filter(f => new Date(f.created_at) < cutoff).map(f => f.name);
    if (oldFiles.length) {
      await supabase.storage.from('Brickyard-Images').remove(oldFiles);
      console.log(`Deleted ${oldFiles.length} old files`);
    } else {
      console.log('No old files to delete');
    }
  });