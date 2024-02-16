const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('.dashboard h2')
const thumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const audio = $('#audio')
const progress = $('.progress')
const forward = $('.btn-next')
const backward = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const song = $('.song')
const playlist = $('.playlist')
const duration = $('.duration')
const remaining = $('.remaining')


const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Em gái mưa',
            singer: 'Hương Tràm',
            path: './assets/music/Emgaimua.mp3',
            image: './assets/img/emgaimua.jpg'
        },
        {
            name: 'Cho em gần anh thêm chút nữa',
            singer: 'Hương Tràm',
            path: './assets/music/ChoEmGanAnhThemChutNua-HuongTram-7058431.mp3',
            image: './assets/img/choemgananhthemchutnua.jpg'
        },
        {
            name: 'Chạm khẽ tim anh một chút thôi',
            singer: 'Noo Phước Thịnh',
            path: './assets/music/Chamkhetimanhmotchutthoi.mp3',
            image: './assets/img/chamkhetimanhmotchutthoi.jpg'
        },
        {
            name: 'Em ngày xưa khác rồi',
            singer: 'Hiền Hồ',
            path: './assets/music/Emngayxuakhacroi.mp3',
            image: './assets/img/emngayxuakhacroi.jpeg'
        },
        {
            name: 'Không thể cùng nhau suốt kiếp',
            singer: 'Hòa Minzy',
            path: './assets/music/Khongthecungnhausuotkiep.mp3',
            image: './assets/img/khongthecungnhausuotkiep.jpeg'
        },
        {
            name: 'Một bước yêu vạn dặm đau',
            singer: 'Mr. Siro',
            path: './assets/music/Motbuocyeuvandamdau.mp3',
            image: './assets/img/motbuocyeuvandamdau.jpg'
        },
        {
            name: 'Trót yêu',
            singer: 'Trung Quân Idol',
            path: './assets/music/Trotyeu.mp3',
            image: './assets/img/trotyeu.jpg'
        },
    ],

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div    
                    class="thumb"
                    style="
                    background-image: url('${song.image}');
                    "
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    formatTime: function (seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },

    handleEvents: function () {

        //CD size
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Playbtn & PauseBtn
        playBtn.onclick = function () {
            if (!app.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }
        //CD rotation
        const cdAnimation = thumb.animate([
            { transform: "rotate(0)" },
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()

        //Music on play
        audio.onplay = function () {
            player.classList.add('playing')
            app.isPlaying = true
            cdAnimation.play()
        }

        //Music on pause
        audio.onpause = function () {
            player.classList.remove('playing')
            app.isPlaying = false
            cdAnimation.pause()
        }
        
        //Progress Line movement
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercentage
                //Timerunning
                duration.textContent = app.formatTime(audio.currentTime);
                remaining.textContent = app.formatTime(audio.duration);
            }
            
        }
        
        //Tua bai hat
        progress.onchange = function (e) {
            const progressPercentageChange = (e.target.value * audio.duration) / 100
            audio.currentTime = progressPercentageChange
        }

        //Nextsong button
        forward.onclick = function () {
            app.isRandom ? app.randomSong() : app.nextSong()
            app.loadCurrentSong()
            audio.play()
            app.render()
            app.scrollIntoView()
        }
        //Prevsong button
        backward.onclick = function () {
            app.isRandom ? app.randomSong() : app.prevSong()
            app.loadCurrentSong()
            audio.play()
            app.render()
            app.scrollIntoView()
        }

        //Randomsong button
        random.onclick = function (e) {
            app.isRandom = !app.isRandom
            random.classList.toggle('active', app.isRandom)
            app.render()
        }

        repeat.onclick = function (e) {
            app.isRepeat = !app.isRepeat
            repeat.classList.toggle('active', app.isRepeat)
        }

        // AutomaciallyNext Song
        audio.onended = function () {
            if (!app.isRepeat && !app.isRandom) {
                console.log(app.isPlaying, app.isRepeat)
                app.nextSong()
                app.render()
                app.loadCurrentSong()
                audio.play()
                app.scrollIntoView()
            }
            else if (app.isRepeat) {
                audio.play()
            }
            else {
                app.randomSong()
                app.render()
                app.loadCurrentSong()
                audio.play()
                app.scrollIntoView()
            }
        }

        //SongClicked
        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(active)')
            if (songElement) {
                app.currentIndex = Number(songElement.dataset.index)
                app.render()
                app.currentSong = app.songs[app.currentIndex]
                app.loadCurrentSong()
                audio.play()
            }
        }

        volume.oninput = function (e) {
            audio.volume = e.target.value / 100;
          };
    },

    scrollIntoView: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
            })
        }, 100)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        thumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        if (app.currentIndex + 1 < app.songs.length) {
            app.currentIndex++
        } else {
            app.currentIndex = 0
        }
        app.currentSong = app.songs[app.currentIndex]
    },

    prevSong: function () {
        if (app.currentIndex - 1 >= 0) {
            app.currentIndex--
        } else {
            app.currentIndex = app.songs.length - 1
        }
        app.currentSong = app.songs[app.currentIndex]
    },

    randomSong: function (e) {
        do {
            var newIndex = Math.floor(Math.random() * app.songs.length)
        } while (app.currentIndex == newIndex)
        app.currentIndex = newIndex
        app.currentSong = app.songs[app.currentIndex]
    },

    run: function () {
        //Lay du lieu bai hat dau tien
        this.defineProperties()
        this.loadCurrentSong()
        //Xu li thu nho thumb khi scroll
        this.handleEvents()
        //Cap nhat bai hat vao Playlist
        this.render()
    }
}

app.run()


