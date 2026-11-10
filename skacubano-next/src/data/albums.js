// Discografía de Ska Cubano.
// Las canciones (título, duración y fragmento de 30 s) están en tracklists.json,
// que se genera desde Apple Music con: npm run tracklists
// type: "studio" (álbum de estudio) o "remix" (álbum de remezclas). La descripción va en ES y EN.
import tracklists from "./tracklists.json";

const albumList = [
  { 
    id: 1, title: "Ska Cubano", cover: "/images/albums/skacubano.jpg", year: "2004", type: "studio",
    description: {
      es: "El disco de debut: el ska jamaicano de los años 60 se cruza con el son, el mambo y el chachachá de la Cuba de siempre.",
      en: "The debut album: 1960s Jamaican ska meets the son, mambo and cha-cha-chá of classic Cuba.",
    },
    links: { 
      sp: "https://open.spotify.com/intl-es/album/3N58JMWyiCXtS0uJB5Kvxt?si=jB9p9RSnTsGstRTSSgQAbw",
      yt: "https://www.youtube.com/watch?v=wnMAwJ4KaPM&list=OLAK5uy_ll4KrcoDJi0_RU3fwPh0zAePNQo33j5KQ",
      ap: "https://music.apple.com/es/album/ska-cubano/949685364" 
    } 
  },
  { 
    id: 2, title: "¡Ay Caramba!", cover: "/images/albums/caramba.jpg", year: "2005", type: "studio",
    description: {
      es: "El segundo disco de estudio: más metales, más ritmo y la energía del directo que la banda llevó de gira por medio mundo.",
      en: "The second studio album: more brass, more rhythm and the live energy the band took on tour around the world.",
    },
    links: { 
      sp: "https://open.spotify.com/intl-es/album/6dGWSlqez8ptLOJBCt1ymW?si=afdcvAJvT2OK5qXWkgrZXA",
      yt: "https://www.youtube.com/watch?v=nwLyUCy7O7A&list=OLAK5uy_k0ldgoIleSHm7Ljh7-cr_NnXXH-dyWLVY",
      ap: "https://music.apple.com/es/album/ay-caramba/902312351" 
    } 
  },
  { 
    id: 3, title: "Ajiaco!", cover: "/images/albums/ajiaco.jpg", year: "2007", type: "remix",
    description: {
      es: "Un ajiaco de remezclas: DJs y productores de todo el mundo reinventan las canciones de la banda para la pista de baile.",
      en: "A stew of remixes: DJs and producers from around the world rework the band's songs for the dance floor.",
    },
    links: { 
      sp: "https://open.spotify.com/intl-es/album/4l0RKxCjk4xB9a4lsQ6SXK?si=cFJxv-07QR-5Hrrx_oADYQ",
      yt: "https://www.youtube.com/watch?v=40_2h7Vkpo8&list=OLAK5uy_kOaE4-Bqj6IwANG6RfDGqqQmewJ1T7I8g",
      ap: "https://music.apple.com/es/album/ajiaco-the-remix-album/705272102" 
    } 
  },
  { 
    id: 4, title: "Mambo Ska", cover: "/images/albums/mamboska.jpg", year: "2010", type: "studio",
    description: {
      es: "Mambo y ska en un mismo compás: big band, tumbaos y contratiempos para no dejar de bailar.",
      en: "Mambo and ska in the same bar: big-band brass, Cuban grooves and off-beats that never stop moving.",
    },
    links: { 
      sp: "https://open.spotify.com/intl-es/album/7qfCYynbJSqc6OzpLQwRy6?si=x5ulwQg5TsuDsn1MhpTHvg",
      yt: "https://www.youtube.com/watch?v=Es62wlmIlyE&list=OLAK5uy_m0kRcur0qgsmu9v5gZDePEDx4pXJiCFGg",
      ap: "https://music.apple.com/es/album/mambo-ska/1617405456" 
    } 
  },
];

// ID del álbum en Apple Music a partir de su enlace (music.apple.com/.../album/<nombre>/<id>)
export function appleAlbumId(url) {
  const m = (url || "").match(/\/album\/(?:[^/]+\/)?(\d+)/);
  return m ? m[1] : null;
}

export const albums = albumList.map((album) => {
  const appleId = appleAlbumId(album.links.ap);
  return { ...album, appleId, tracks: (appleId && tracklists[appleId]?.tracks) || [] };
});
