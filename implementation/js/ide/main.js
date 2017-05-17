/**
 * Sample MAIN script.
 *
 * @author Stagejs.CLI
 * @created Fri Jan 20 2017 01:27:21 GMT-0800 (PST)
 */
;(function(app){

	/////////////////setup/////////////////
	app.setup({
		template: '@ide.html', //can be undefined if using layout
		layout: undefined,
		contextRegion: 'contexts',
		curtains: {},

		//Note: Always set navRegion if using app template here, unless you've merged it(the tpl) with index.html;
		//defaultContext: '_IDE/Create',
		defaultContext: '_IDE',
		viewSrcs: 'js/ide', //set this to a folder path to enable view dynamic loading. 
		//---------------------------------------------------------------------------------------------
		fullScreen: false, //this will put <body> to be full screen sized (window.innerHeight).
		//---------------------------------------------------------------------------------------------
		i18nTransFile: 'i18n.json', //can be {locale}.json
		i18nLocale: '', //if you really want to force the app to certain locale other than browser preference. (Still override-able by ?locale=.. in url)
		//---------------------------------------------------------------------------------------------
		baseAjaxURI: '', //modify this to fit your own backend apis. e.g index.php?q= or '/api'
		timeout: 5 * 60 * 1000 //general communication timeout (ms), e.g when using app.remote()
	});

	//_IDE view
	// app.view('_IDE', {
	// 	attributes: {
	// 		style: 'height:100%;width:100%;'
	// 	},
	// 	template: '<div region="ide-content" style="height:100%;width:100%;">1</div>',
	// 	navRegion: 'ide-content'
	// });

	//_IDE view
	app.context('_IDE', {
		attributes: {
			style: 'height:100%;width:100%;'
		},
		data: '/api/getViewList',
		layout: {
			split: [
				'300px:.list-holder:"<div class="title"><span class="text">VIEWS</span></div>{{#items}}<div class="view-list-item" action="edit-view"><span class="text">{{.}}</span></div>{{/items}}"',
				'1:.info-holder:<span>Stage-IDE powered by Stage.js framework. <i class="fa fa-github"></i></span>'
			],
			dir: 'v',
			bars: false
		},
		//template: '<div region="ide-content" style="height:100%;width:100%;">IDE</div>',
		
		//navRegion: 'ide-content',
		
	});

	///////////initializers/////////// - [optional]
	app.addInitializer(function(){
		//reload previously stored configuration
		
		var endPoints, hlines, vlines, temp, regionView;

		if(app.store.get('current')){//has currently actived template

			//if has current, compare whether temporary is same as current,
			//if yes, old logic show current
			//if not, show the temporary

			temp = app.store.get(app.store.get('current'));
			//make temp.regionView undefined if not exist in order to be compared with cached
			temp.regionView = temp.regionView || undefined;

			var cached = {};
			_.each(temp, function(obj, key){
				cached[key] = app.store.get(key);
			});

			//deep compare two objects
			if(!_.isEqual(cached, temp)){
				app.store.remove('current'); //not equal remove current
			}

			endPoints = cached.endPoints;
			hlines = cached['horizontal-line'];
			vlines = cached['vertical-line'];
			regionView = cached.regionView;

		}else{//no currently actived template
			
			endPoints = app.store.get('endPoints');
			hlines = app.store.get('horizontal-line');
			vlines = app.store.get('vertical-line');
			regionView = app.store.get('regionView');
		}
		
		if(endPoints && hlines && vlines){
			app._global = app._global || {};
			app._global.endPoints = endPoints;
			app._global['horizontal-line'] = hlines;
			app._global['vertical-line'] = vlines;
			app._global.regionView = regionView;
		}

		app.debug('cached..', endPoints, hlines, vlines);
		app.debug('regionView::store, _global', app.store.get('regionView'), app._global && app._global.regionView);
	});

	app.addInitializer(function(){
		//menu status
		//use __opened__ as local key to store menu status
		if(!app.store.get('__opened__')) app.store.set('__opened__', false);

		//save generation
		var gen = app.store.get('generation');
		if(gen)
			gen = gen + 1;
		else
			gen = 1;

		app._global = app._global || {};
		app._global.generation = gen;
		app.store.set('generation', gen);

	});
	//Note: initializer can return a promise object for async loading, 
	//add more initializers if you need. e.g `return app.remote() or $.ajax()`.
	
	///////////////////////////warning///////////////////////////
	//Don't put app.run() here, use the one found in index.html//
	/////////////////////////////////////////////////////////////

})(Application);