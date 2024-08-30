import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { IoMdPlayCircle } from "react-icons/io";
import { IoHeartCircle } from "react-icons/io5";
import { FaCircleDown } from "react-icons/fa6";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  description: string;
  url: string;
  control: boolean;
  autoPlay: boolean;
  muted: boolean;
  onView: ()=>void;
}

const MainContainer = styled(Box)({
    border: '1px solid rgb(0,0,0,0.1)',
    borderRadius: '0.375rem',
    Padding:'0.75rem',
    margin:'1rem',
    overflow:'hidden',
});

const VideoCardComponent = (props: Props) => {
    const [isPlaying, setIsPlaying] = useState(props.autoPlay);

    useEffect(() => {
        setIsPlaying(props.autoPlay);
    }, [props.autoPlay]);

  return (
    <MainContainer>
        <Box sx={{position:'relative'}}>
            <div
                onMouseEnter={()=>setIsPlaying(true)}
                onMouseLeave={()=>setIsPlaying(false)}
                style={{width:'100%', height:'100%'}}
            >
                <ReactPlayer
                    width={'100%'}
                    height={'100%'}
                    url={props.url}
                    controls={props.control}
                    loop={true}
                    playing={isPlaying}
                    muted={props.muted}
                    playIcon={<IoMdPlayCircle/>}
                    previewTabIndex={100}
                    progressInterval={100}
                />
            </div>
            <Box sx={{position:'absolute', right:10, top:10, color:"#fff"}}>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center'}}>
                    <Box sx={{display:'flex', flex: 1, flexDirection:'column', justifyContent:'center', alignItems:'center', '&:hover':{cursor:'pointer'}}}>
                        <IoMdPlayCircle style={{fontSize: '2rem'}}/>
                        <Typography>10</Typography>
                    </Box>
                    <Box sx={{display:'flex', flex: 1, flexDirection:'column', justifyContent:'center', alignItems:'center', mt: 5, '&:hover':{cursor:'pointer'}}}>
                        <IoHeartCircle style={{fontSize: '2rem'}}/>
                        <Typography>10</Typography>
                    </Box>
                    <Box sx={{display:'flex', flex: 1, flexDirection:'column', justifyContent:'center', alignItems:'center', mt: 5, '&:hover':{cursor:'pointer'}}}>
                        <IoArrowRedoCircleSharp style={{fontSize: '2rem'}}/>
                        <Typography>5</Typography>
                    </Box>
                    <Box sx={{display:'flex', flex: 1, flexDirection:'column', justifyContent:'center', alignItems:'center', mt: 5, '&:hover':{cursor:'pointer'}}}>
                        <FaCircleDown style={{fontSize: '1.5rem'}}/>
                        <Typography>5</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Box sx={{padding:'1rem'}}>
            <Typography variant='h6' className='line-clamp-1'>{props.title}</Typography>
            <Typography component={'p'} sx={{padding:'0.5rem  0rem 1rem'}} className='line-clamp-2 mt-2 leading-relaxed'>{props.description}</Typography>
        </Box>
    </MainContainer>
  )
}

export default VideoCardComponent