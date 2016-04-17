(function(){
	function SongPlayer(Fixtures){
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

		var setSong = function(song){
			if (currentBuzzObject){
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			}

			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});

			SongPlayer.currentSong = song;

		};

		/**
		@function playSong
		@desc plays current Buzz object, sets playing attribute
		@param {Obj} song
		*/

		var playSong = function(song){
			currentBuzzObject.play();
			song.playing = true;
		};

		var getSongIndex = function(song){
			return currentAlbum.songs.indexOf(song);
		};

		/**
		@desc song object, contains audioUrl attribute & more
		@type {Obj}
		*/

		SongPlayer.currentSong = null;

		SongPlayer.play = function(song){
			song = song || SongPlayer.currentSong;
			if (SongPlayer.currentSong !== song){
				setSong(song);
				playSong(song);
			} else if (SongPlayer.currentSong === song){
				if (currentBuzzObject.isPaused()){
					playSong(song);
				}
			}
		};

		SongPlayer.pause = function(song){
			song = song || SongPlayer.currentSong;
			currentBuzzObject.pause();
			song.playing = false;
		};

		SongPlayer.previous = function(){
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex--;

			if (currentSongIndex < 0){
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			} else {
				var song = currentAlbum.songs[currentSongIndex];
				setSong(song);
				playSong(song);
			}
		};

		return SongPlayer;
	}

	angular
		.module('blocJams')
		.factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
