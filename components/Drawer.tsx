'use client';
// custom drawer component, because drawers are used everywhere in the
// app and I was tired of fighting with MUI's drawers and their limitations
// slides in from the left on desktop, underneath previous drawers
// slides in from the bottom on mobile and covers previous drawers
import React, { useState, useEffect, useRef } from 'react';
import sleep from '@/lib/sleep';
import classes from './Drawer.module.css';

// MUI imports
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

///// usePrevious HOOK /////
// stores a value (like a state) in a ref, which *is not* recomputed on
// component update, allowing us to access the previous state of a component
const usePrevious = function (value: any) {
  const ref = useRef<any>();
  // the current value in ref is immediately returned, and then
  // useEffect runs to update it with the next value
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

///// DRAWER COMPONENT /////
const Drawer: React.FC<{
  children: React.ReactNode;
  variant: 'temporary' | 'permanent';
  layer: 1 | 2 | 3; //determines where it's rendered. higher layers render beneath on desktop and above on mobile
  isOpen: boolean; //is this being rendered or not?
  timeout?: number; //how long slide transitions last
  onClose?: () => void;
  sx?: React.CSSProperties;
}> = function ({
  children,
  variant,
  layer,
  isOpen,
  timeout = 300,
  onClose = () => {},
  sx,
}) {
  // initialize state based on the isOpen state passed down when the component is mounted
  const [transitionState, setTransitionState] = useState<
    'entering' | 'entered' | 'exiting' | 'exited'
  >(isOpen ? 'entered' : 'exited');

  useEffect(() => {
    const slideOpen = async () => {
      // do something only if the drawer is closed
      if (transitionState === 'exited') {
        // set this component to be rendered in the DOM
        setTransitionState('entering');
        // wait a moment for it to render
        // this is *such* a hack. what I wanted to do is listen for the component to update,
        // and *then* set the state to 'entered', but that would make our state depend on component
        // render, and it is a bad pattern to set state inside the code that runs on every component update
        // so instead we just wait 50ms for react to do all its component updates
        await sleep(50);
        // and set it to slide open
        setTransitionState('entered');
      }
    };
    const slideClosed = async () => {
      if (transitionState === 'entered') {
        // slide drawer closed
        setTransitionState('exiting');
        // wait for animation to finish
        await sleep(timeout);
        // remove it from the DOM
        setTransitionState('exited');
      }
    };
    if (isOpen) {
      slideOpen();
    } else {
      slideClosed();
    }
  }, [isOpen, timeout, transitionState]);

  // handlers
  const handleClose = () => {
    // this should change render state in the parent component and thus
    // change the isOpen prop fed into this component
    onClose();
  };

  // derive classes from given props and state
  const styles = `${
    // base .drawer class
    classes.drawer
  } ${
    // determine transition state
    classes[transitionState]
  } ${
    // what layer is this being rendered on?
    classes[`layer-${layer}`]
  } ${
    // is this a full-height or half-height drawer?
    layer === 1 ? classes['half-height'] : classes['full-height']
  }`;

  return (
    <>
      {transitionState !== 'exited' && (
        <Paper
          sx={{ ...sx }}
          className={styles}
          style={{ transition: `all ${timeout}ms` }}
        >
          {variant === 'temporary' && (
            <Button onClick={handleClose} fullWidth>
              <KeyboardDoubleArrowLeftIcon />
            </Button>
          )}
          {children}
        </Paper>
      )}
    </>
  );
};

export default Drawer;
