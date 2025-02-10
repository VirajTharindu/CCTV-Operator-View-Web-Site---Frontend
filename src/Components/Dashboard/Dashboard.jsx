import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, SkipBack, Play, SkipForward, Pause, Bell, Settings, User, Search } from 'lucide-react';
import './Dashboard.css';


const STREAMS = [
  { id: '1', name: 'Stream 1', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '2', name: 'Stream 2', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '3', name: 'Stream 3', videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
  { id: '4', name: 'Stream 4', videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
  { id: '5', name: 'Stream 5', videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
  { id: '6', name: 'Stream 6', videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
];

const DATA_ITEMS = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  content: `data ${i + 1}`,
}));

const PLATE_DETAILS = Array.from({ length: 7 }, (_, i) => ({
  id: String(i + 1),
  label: `label ${i + 1}`,
}));



const Dashboard = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Add a key to force video element remounting
  const videoRef = useRef(null);

  const [notifications, setNotifications] = useState(3); // Example notification count
  const [searchQuery, setSearchQuery] = useState('');


  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  

  // Reset video player when switching streams
  const resetVideoPlayer = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load(); // Force video element to reload
    }
    setIsPlaying(false);
  }, []);

  const handleStreamClick = useCallback((stream) => {
    setSelectedStream(stream);
    setKey(prevKey => prevKey + 1); // Increment key to force remount
    resetVideoPlayer();
  }, [resetVideoPlayer]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Ensure video is loaded before playing
        videoRef.current.load();
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle video errors
  const handleVideoError = useCallback((e) => {
    console.error('Video error:', e);
    setIsPlaying(false);
    resetVideoPlayer();
  }, [resetVideoPlayer]);

  // Clean up video when component unmounts or stream changes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [selectedStream]);

  const renderStreamList = () => (
    <div className={`stream-list-panel ${isMaximized ? 'hidden' : ''}`}>
      <div className="panel-header">
        <span>CCTV Camera Stream List</span>
      </div>
      <div className="streams">
        {STREAMS.map(stream => (
          <div
            key={stream.id}
            className={`stream-box ${selectedStream?.id === stream.id ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handleStreamClick(stream)}
            aria-label={`Select ${stream.name}`}
            aria-pressed={selectedStream?.id === stream.id}
          >
            {stream.name}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStreamingPanel = () => (
    <div className={`streaming-panel ${isMaximized ? 'maximized' : ''}`}>
      <div className="panel-header">
        <span>{selectedStream ? selectedStream.name : 'No Stream Selected'}</span>
        <button
          className="maximize-btn"
          onClick={toggleMaximize}
          aria-label={isMaximized ? 'Restore panel' : 'Maximize panel'}
          title={isMaximized ? 'Restore panel' : 'Maximize panel'}
        >
          {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      <div className="video-container" role="region" aria-label="Video Player">
        {selectedStream ? (
          <video
            key={key} // Add key to force remount when changing streams
            ref={videoRef}
            className="video-player"
            width="100%"
            height="100%"
            aria-label={`Video stream: ${selectedStream.name}`}
            onEnded={() => setIsPlaying(false)}
            onError={handleVideoError}
            playsInline // Add playsInline for better mobile support
          >
            <source src={selectedStream.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="no-stream-message">
            Select a stream from the list to begin playback
          </div>
        )}
      </div>
      <div className="playback-controls">
        <button 
          className="control-btn" 
          aria-label="Previous"
          disabled={!selectedStream}
        >
          <SkipBack size={24} />
        </button>
        <button 
          className="control-btn play" 
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={handlePlayPause}
          disabled={!selectedStream}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          className="control-btn" 
          aria-label="Next"
          disabled={!selectedStream}
        >
          <SkipForward size={24} />
        </button>
        <button
          className="control-btn fullscreen-btn"
          aria-label="Fullscreen"
          disabled={!selectedStream}
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
              } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
              } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
              }
            }
          }}
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </div>
  );

  const renderDataAndPlatePanel = () => (
    <div className={`data-and-plate ${isMaximized ? 'hidden' : ''}`}>
      <div className="data-list-panel">
        <div className="panel-header">Data List</div>
        <div className="data-items">
          {DATA_ITEMS.map(item => (
            <div key={item.id} className="data-item">
              {item.content}
            </div>
          ))}
        </div>
      </div>

      <div className="plate-details-panel">
        <div className="panel-header">Number Plate Details</div>
        <div className="plate-content">
          <div className="plate-image" role="img" aria-label="License plate image">
            image
          </div>
          <div className="plate-labels">
            {PLATE_DETAILS.map(detail => (
              <div key={detail.id} className="label">
                {detail.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const renderNavigationBar = () => (
    <nav className="navigation-bar">
      <div className="nav-left">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2" />
            <circle cx="12" cy="12" r="6" fill="#fff" />
          </svg>
          <h1>AASL Operator View</h1>
        </div>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="nav-right">
        <button className="nav-btn" aria-label="Notifications">
          <Bell size={20} />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </button>
        <button className="nav-btn" aria-label="Settings">
          <Settings size={20} />
        </button>
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <span className="user-name">Admin User</span>
        </div>
      </div>
    </nav>
  );


  return (
    <div className={`dashboard-container ${isMaximized ? 'maximized-mode' : ''}`}>
       {renderNavigationBar()}
      <main className="main-content">
        {renderStreamList()}
        {renderStreamingPanel()}
        {renderDataAndPlatePanel()}
      </main>
    </div>
  );
};

export default Dashboard;