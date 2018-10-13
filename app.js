const fs = require('fs');
const URL = require('url');
const http = require('http');
const request = require('request');
const express=require('express');
var app=express();
var ip=[];


const port = 8080;
const homeHTML = fs.readFileSync('./home.html', 'utf-8');
var ipArr=[];

function requestInstance(url, ua) {
	return request({
		url,
		headers: { 'User-Agent': ua }
	})
}
function getClientIp(req){
	return req.headers['x-forwarded-for']||req.connection.remoteAddress||req.socket.remoteAddress||req.connection.socket.remoteAddress;
}


app.get("*", function(req, res) {
   const url = URL.parse(req.url, true);
   if (url.pathname === '/') {
		var s=getClientIp(req);
		ip.push(s);
		// 首页
		res.writeHeader('200', { 'Contetn-Type': 'text/html' });
		fs.createReadStream('./home.html').pipe(res);
	} else if (url.pathname === '/bg') {
		// 每日必应壁纸加速
		req.pipe(requestInstance(`https://bing.ioliu.cn/v1?${url.search}`, req.headers['user-agent'])).pipe(res);
	} else if(url.pathname === '/hq'){
		
		req.pipe(requestInstance(`http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=C._A&sty=FCOIATA&sortType=(ChangePercent)&sortRule=-1&page=2&pageSize=3512&js=var%20UzrklqQq={rank:[(x)],pages:(pc),total:(tot)}&token=7bc05d0d4c3c22ef9fca8c2a912d779c&jsName=quote_123&_g=0.628606915911589&_=1519475517691`, req.headers['user-agent'])).pipe(res);
	}else if(url.pathname==='/video'){
		//vip视频
		res.writeHeader('200', { 'Contetn-Type': 'text/html' });
		fs.createReadStream('./video.html').pipe(res);
	}else{
		// 代理其他请求到 google.com 下
		req.pipe(requestInstance(`https://www.google.com/${url.path}`, req.headers['user-agent'])).pipe(res);
	}
});
app.listen(port)
