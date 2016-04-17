(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        /**
        @desc = Album file with attributes
        @type = {Obj}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
        @desc Buzz object sound file
        @type {Obj}
        */
        var currentBuzzObject = null;

        /**
        @function setSong
        @desc Stops currently playing song, loads new audio file as currentBuzzObject
        @param {Obj} song
        */

        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(song);
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
              $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;

        };

        /**
        @function playSong
        @desc plays current Buzz object, sets playing attribute
        @param {Obj} song
        */

        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
        @desc song object, contains audioUrl attribute & more
        @type {Obj}
        */

        SongPlayer.currentSong = null;

        /**
        @desc Current playback time (in seconds) of currently playing song
        @type {Num}
        */

        SongPlayer.currentTime = null;

        /**
        @desc Current volume of music(0-100)
        @type {Num}
        */

        SongPlayer.volume = 50;

        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };

        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
          currentSongIndex++;

            if (currentSongIndex > (currentAlbum.songs.length - 1)) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        SongPlayer.setVolume = function(volume){
          	currentBuzzObject.setVolume(volume);
         		SongPlayer.volume = volume;
       	};

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
