const {src, dest, parallel, series, watch} = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const through = require('through2')

const ENV = {}

exports.watch = function(){
	watch(
		[
			'./src/**'
		],
		{ignoreInitial: false},
		series([
			()=>src([
				'./src/*.scss'
			])
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(through.obj((file, nil, done)=>{
				ENV.css = file.contents.toString()
				done()
			})),

			()=>src([
				'./src/tumblr.html'
			])
			.pipe(through.obj((file, nil, done)=>{
				file.contents = Buffer.from(file.contents.toString().replace('%css%', `<style>${ENV.css.trim()}</style>`))
				done(null, file)
			}))
			.pipe(rename('output.txt'))
			.pipe(dest('.'))
		])
	)
}