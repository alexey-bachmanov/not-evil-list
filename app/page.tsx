'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import DetailsDrawer from '@/components/DetailsDrawer';
import SearchDrawer from '@/components/SearchDrawer';
import EditsDrawer from '@/components/EditsDrawer';
import AlertBar from '@/components/AlertBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import LoginDialog from '@/components/LoginDialog';
// leaflet assumes window object exists when it first runs, so to
// avoid SSR errors, we need to avoid even importing our Map component
// to keep leaflet from running
// import Map from '@/components/Map';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// MUI imports

export default function HomePage() {
  return (
    <>
      <SearchDrawer />
      <DetailsDrawer />
      <EditsDrawer />
      <LoginDialog />
      <AlertBar />
      <HamburgerMenu />
      <Map />
    </>
  );
}
