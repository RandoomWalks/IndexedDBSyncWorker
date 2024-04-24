const dbWorker = new Worker('dbWorker.js');

dbWorker.onmessage = function(e) {
    const { type, item, id, error } = e.data;
    switch (type) {
        case 'added':
            console.log(`Item added with ID: ${id}`);
            break;
        case 'got':
            console.log(`Received item:`, item);
            break;
        case 'error':
            console.error('Database operation failed:', error);
            break;
    }
};

// Example to add an item
dbWorker.postMessage({ type: 'add', payload: { content: 'Sample item', lastModified: new Date().toISOString(), syncStatus: 'pending' } });

