// http://127.0.0.1:9001
// http://localhost:9001

var server = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

var port = 9001;
var LatestRecordName = '';
function serverHandler(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    console.log(filename);
    var isWin = !!process.platform.match(/^win/);

    if (filename && filename.toString().indexOf(isWin ? '\\uploadFile' : '/uploadFile') != -1 && request.method.toLowerCase() == 'post') {
        uploadFile(request, response);
        return;
    }

    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + filename + '\n');
            response.end();
            return;
        }

        if (filename.indexOf('favicon.ico') !== -1) {
            return;
        }

        if (fs.statSync(filename).isDirectory() && !isWin) {
            filename += '/index.html';
        } else if (fs.statSync(filename).isDirectory() && !!isWin) {
            filename += '\\index.html';
        }

        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write(err + '\n');
                response.end();
                return;
            }

            var contentType;

            if (filename.indexOf('.html') !== -1) {
                contentType = 'text/html';
            }

            if (filename.indexOf('.js') !== -1) {
                contentType = 'application/javascript';
            }

            if (contentType) {
                response.writeHead(200, {
                    'Content-Type': contentType
                });
            } else response.writeHead(200);

            response.write(file, 'binary');
            response.end();
        });
    });
}

var app;

app = server.createServer(serverHandler);

app = app.listen(port, process.env.IP || "0.0.0.0", function() {
    var addr = app.address();

    if (addr.address == '0.0.0.0') {
        addr.address = 'localhost';
    }

    app.address = addr.address;
   
    console.log("Server listening at", 'http://' + addr.address + ":" + addr.port);
});

function uploadFile(request, response) {
    // parse a file upload
    var mime = require('mime');
    var formidable = require('formidable');
    var util = require('util');

    var form = new formidable.IncomingForm();

    var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';

    form.uploadDir = __dirname + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;

    form.parse(request, function(err, fields, files) {
        var file = util.inspect(files);

        response.writeHead(200, getHeaders('Content-Type', 'application/json'));

        var fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');
        var fileURL = 'http://' + app.address + ':' + port + '/uploads/' + fileName;

       
        var array = fileURL.split('/');
        var getLaestupdate = array[array.length - 1];
        LatestRecordName = array[array.length - 1];
        console.log(LatestRecordName);





     
        var ffmpeg = require('ffmpeg');
        try {
           
            var a = LatestRecordName;
            var path = require('path');
            var appDir = path.dirname(require.main.filename);
            var test = appDir + '\\uploads\\' + LatestRecordName;

      

            var ffmpegFluent = require('fluent-ffmpeg');
          

            new ffmpeg(test, function (err, video) {
                if (!err) {
                    console.log('The video is ready to be processed');
                    video.fnAddWatermark(appDir + '\\Images\\flyer-watermark.png', appDir + '\\Videos\\' + LatestRecordName, {
                        position: 'SE'
                        }, function (error, file) {
                            // fs.readdir(appDir + '\\Videos\\', function (err, items) {
                                // console.log(items);
                                // //console.log(items);
                                // var Videos = [];
                                // var processs;
                                // for (var i = 0; i < items.length; i++) {

                                    // Videos[i] = appDir + '\\Videos\\' + items[i];

                                    // fname = Videos[i];
                                    // if (i == 0) {
                                        // processs = ffmpegFluent().mergeAdd(fname);
                                    // }
                                    // else {
                                        // processs.mergeAdd(fname);
                                    // }
                                    // //start += 1;
                                    // console.log(fname);

                                // }

                                // processs.mergeToFile(appDir + '\\Videos\\Result.mp4', function (err, items)  {

                                    // if (!err)
                                        // console.log('New video file: Result.mp4 ');
                                    // else
                                        // console.log('Error: ' + err);
                                // });
                                   
                               
                               
                            // });




                            fs.readdir(appDir + '\\Videos\\', function (err, items) {

                                //console.log(items);
                                var video1, video2, video3, video4;
                                var Videos = [];
                                var processs;
                                for (var i = 0; i < items.length; i++) {
                                    if (items.length > 3) {
                                        if (i < 4) {
                                            Videos[i] = appDir + '\\Videos\\' + items[i];

                                            //fname = "'" + Videos[i].replace(/\\/g, "\\") + "'";
                                            fname = Videos[i].replace(/\\/g, "\\\\");
                                            if (i == 0) {
                                                video1 = fname;
                                            }
                                            if (i == 1) {
                                                video2 = fname;
                                            }

                                            if (i == 2) {
                                                video3 = fname;
                                            }
                                            if (i == 3) {
                                                video4 = fname;
                                            }

                                        }
                                    }
                                }
                                if (video1 != null && video2 != null && video3 != null && video4 != null) {
                                   
                                    ffmpegFluent().input(video1).input(video2).input(video3).input(video4).
                                        complexFilter([
                                            'nullsrc=size=480x320 [base]',
                                            '[0:v] setpts= PTS - STARTPTS, scale = 200x320 [upperleft]',                                             
                                            '[1:v] setpts= PTS - STARTPTS, scale =  200x320 [upperright]',
                                            '[2:v] setpts= PTS - STARTPTS, scale =  200x320 [lowerleft]',
                                            '[3:v] setpts= PTS - STARTPTS, scale =  200x320 [lowerright]',
                                              '[base][upperleft] overlay= shortest = 1[tmp1]',
                                            '[tmp1][upperright] overlay= shortest = 1:x = 120[tmp2]',
                                              '[tmp2][lowerleft] overlay= shortest = 1:x = 240[tmp3]',
                                             '[tmp3][lowerright] overlay= shortest = 1:x = 360[topout]', 
                                            //'[0:v][1:v]hstack[top]',
                                            //'[2:v][3:v]hstack[top2]',
                                            //'[top][top2]hstack[topout]'
                                        ])
                                        .outputOptions([
                                            '-map [topout]'
                                        ])
                                        .output("output.mp4")
                                        .on("error", function (er) {
                                            console.log("error occured: " + er.message);
                                        })
                                        .on("end", function () {
                                            console.log("success");
                                        })
                                        .run();
                                }

                                if (!error)
                                    console.log('New video file: ' + file);
                                else
                                    console.log('Error: ' + error);
                            });
                        if (!error)
                            console.log('New video file: ' + file);
                            else
                            console.log('Error: ' + error);
                        });

						
                  //    video.fnExtractFrameToJPG(appDir + '\\Frames\\', {
                    //    frame_rate: 1,

                    //    number: 5,
                    //    file_name: 'MyNew_%t_%s'
                    //}, function (error, files) {
                    //    if (!error)
                         
                       

                        //    //var images = [
                        //    //    'step1.jpg',
                        //    //    'step2.jpg',
                        //    //    'step3.jpg',
                        //    //    'step4.jpg'
                        //    //]

                        //    var videoOptions = {
                        //        fps: 25,
                        //        loop: 2, // seconds
                        //        transition: true,
                        //        transitionDuration: 1, // seconds
                        //        videoBitrate: 1024,
                        //        videoCodec: 'libx264',
                        //        size: '640x?',
                        //        audioBitrate: '128k',
                        //        audioChannels: 2,
                        //        format: 'mp4',
                        //        pixelFormat: 'yuv420p'
                        //    }

                        //    videoshow(images, videoOptions)
                        //        .save(appDir + '\\Videos\\' + LatestRecordName.replace('webm','mp4'))
                        //        .on('error', function () { })

                        //        .on('error', function (err, stdout, stderr) {
                        //            console.error('Error:', err)
                        //            console.error('ffmpeg stderr:', stderr)
                        //        })
                        //        .on('end', function (output) {
                        //            console.error('Video created in:', output)
                        //        })

                        //});

                   // });
                //} else {
                //    console.log('Error: ' + err);
                }
            }).withAspect('4:3')
                .withSize('640x480');
                }
                 catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }









        console.log('fileURL: ', fileURL);
        response.write(JSON.stringify({
            fileURL: fileURL
        }));
        response.end();
    });
}

function getHeaders(opt, val) {
    try {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "https://secure.seedocnow.com";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";

        if (opt) {
            headers[opt] = val;
        }

        return headers;
    } catch (e) {
        return {};
    }
}











