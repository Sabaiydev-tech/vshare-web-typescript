import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { BsFillShareFill } from 'react-icons/bs';
import DialogShare from 'components/dialog/DialogShare.SocialMedia';

interface Props {
    shareLink: string;
}


const StickyShareButton: React.FC<Props> = ({ shareLink }) => {
    const [isSticky, setSticky] = useState(false);
    const [isOpenShare, setIsOpenShare] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    const debounce = (func: (...args: any[]) => void, delay: number) => {
      let timeout: NodeJS.Timeout;
      return function (...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(args), delay);
      };
    };
  
    const handleScroll = debounce(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const topThreshold = 70;
        const isElementInViewport = rect.top <= topThreshold && rect.bottom >= 0;
        setSticky(isElementInViewport);
      }
    }, 0);
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return (
      <Box
        ref={ref}
        sx={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? '90px' : 'auto',
          right: isSticky ? '205px' : 'auto',
          zIndex: isSticky ? 99 : 'auto',
          transition: 'top 0.3s ease-in-out',
        }}
      >
        <Button
          type="button"
          variant={isSticky ? 'contained' : 'outlined'}
          sx={{ borderRadius: '8px', fontSize: '14px' }}
          startIcon={<BsFillShareFill size={18} />}
          onClick={() => setIsOpenShare(!isOpenShare)}
        >
          Share
        </Button>
  
        {isOpenShare && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenShare(false);
            }}
          >
            <DialogShare
              onClose={() => setIsOpenShare(false)}
              isOpen={isOpenShare}
              url={shareLink || window.location.href}
            />
          </Box>
        )}
      </Box>
    );
  };

export default StickyShareButton;
