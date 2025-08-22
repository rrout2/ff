import React from 'react';
import Whiteboard from './redraft/whiteboard/Whiteboard.jsx';
import WhiteboardSite from './whiteboard-site/SitePage.jsx';

// Show the website builder when ?site=1 is present
export default function App() {
  const useSite = typeof window !== 'undefined' && window.location.search.includes('site=1');
  return useSite ? <WhiteboardSite /> : <Whiteboard />;
}
