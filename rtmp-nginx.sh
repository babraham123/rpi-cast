 #!/bin/bash  
 on_die () {  
   # kill all children  
   pkill -KILL -P $$  
 }  
 trap 'on_die' TERM  
 raspivid -n -mm matrix -w 1280 -h 720 -fps 25 -g 100 -t 0 -b 5000000 -o - \  
  | ffmpeg -y \  
    -f h264 \  
    -i - \  
    -c:v copy \  
    -map 0:0 \  
    -f flv \  
    -rtmp_buffer 100 \  
    -rtmp_live live \  
    rtmp://localhost/rtmp/live &  
 wait  