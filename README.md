# MusicBee Web Client

This project is a MusicBee remote control client that connects to the [MusicBee Remote Plugin fork I made](https://github.com/nitzanbueno/plugin/tree/websockets).

It uses WebSockets as an interface and is written in React and Material-UI.

![image](https://github.com/nitzanbueno/musicbee-web-client/assets/1792977/bd8c8fea-1a0d-4153-95e8-598f6a406ef3)

#### Features:
- View and play library songs, playlists and albums
- Responsive search on all tabs
- "Now Playing" list, with the ability to reorder and delete songs
- Queue songs next/last
- Add songs to playlists
- Play/Pause, scrubbing, and volume control
- Shuffle/Repeat/Auto-DJ control

#### Adaptation
This code base can be reused for a different music server pretty easily.  
The main file to change would be `MusicBeeAPI.ts`, which contacts the MusicBee plugin server via WebSocket.  
All API methods can be switched to communicate with a different client.  
It's important to watch out for the `MusicBeeAPI.addEventListener` function - it uses MusicBee-specific event codes and signatures, and is called in several other components.
