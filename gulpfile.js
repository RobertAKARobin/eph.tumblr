const {src, dest, parallel, series, watch} = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const through = require('through2')
const fs = require('fs')

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
			.pipe(sass({outputStyle: 'expanded'}))
			.pipe(through.obj((file, nil, done)=>{
				ENV.css = `<style>\n${file.contents.toString()}\n</style>`
				done()
			})),

			()=>src([
				'./src/tumblr.html'
			])
			.pipe(through.obj((file, nil, done)=>{
				file.contents = Buffer.from(file.contents.toString().replace(/\%([a-zA-Z0-9_-]+)\%/g, (nil, varname)=>{
					return ENV[varname]
				}))
				done(null, file)
			}))
			.pipe(rename('output.txt'))
			.pipe(dest('.'))
		])
	)
}