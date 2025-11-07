(function(){
	const metadataPath = 'data/geojson/materials_img_metadata.geojson';

	const listEl = document.getElementById('list');

	fetch(metadataPath)
		.then(r => r.json())
		.then(data => initFromMetadata(data.features))
		.catch(err => {
			console.error('Fehler beim Laden von metadata:', err);
			listEl.innerHTML = '<li style="color:red">Fehler beim Laden der Metadaten. Öffne die Seite über einen lokalen Server (z.B. python -m http.server)</li>';
		});

	function initFromMetadata(features){
		const entries = [];

		features.forEach((feature, idx) =>{
			const it = feature.properties;
			const imgPath = toRelativeImagePath(it.file_path || it.file || '');
			const filename = (imgPath && imgPath.split('/').pop()) || (it.file_path || '').split('\\').pop() || `image-${idx}`;
			const date = it['Image DateTime'] || it['EXIF DateTimeOriginal'] || it['Image DateTimeOriginal'] || '';

			const entry = {meta: it, imgPath, filename, date};
			entries.push(entry);
		});
	}

	function toRelativeImagePath(filePath){
		if(!filePath) return '';
		const normalized = filePath.replace(/\\/g, '/');
		const idx = normalized.toLowerCase().indexOf('/img/');
		if(idx>=0){
			return '../../' + normalized.slice(idx+1);
		}
		if(normalized.startsWith('img/')) return '../../' + normalized;
		return '';
	}
})();

