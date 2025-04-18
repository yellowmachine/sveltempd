<script lang="ts">
    // Usamos $props para recibir las propiedades
    let { song }: { song: {title: string; artist: string} | null } = $props();
  
    // Estado local reactivo para release, coverUrl y error
    let release = $state<{
      id: string;
      title: string;
      date?: string;
    } | null>(null);
  
    let coverUrl = $state<string | null>(null);
    let error = $state<string | null>(null);
  

    async function fetchRelease(artist: string, title: string) {
      const query = encodeURIComponent(`artist:"${artist}" AND recording:"${title}"`);
      const url = `https://musicbrainz.org/ws/2/recording/?query=${query}&fmt=json&limit=1`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);
  
      const data = await res.json();
      if (data.recordings && data.recordings.length > 0) {
        const recording = data.recordings[0];
        if (recording.releases && recording.releases.length > 0) {
          const rel = recording.releases[0];
          return {
            id: rel.id,
            title: rel.title,
            date: rel.date
          };
        }
      }
      return null;
    }
    
    async function fetchInfo(artist: string, title: string) {
      try {
        release = await fetchRelease(artist, title);
        if (release) {
          coverUrl = await fetchCoverArt(release.id);
        } else {
          error = 'No se encontró información de la canción.';
        }
      } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido';
      }
    }
    
    async function fetchCoverArt(releaseId: string) {
      const url = `https://coverartarchive.org/release/${releaseId}/front-250`;
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
      return null;
    }
  
    $effect(() => {
        error = null;
        release = null;
        coverUrl = null;

      if (song) {
        fetchInfo(song.artist, song.title); 
      }
    });

  </script>
  
  {#if error}
    <p style="color: red">{error}</p>
  {:else}
    {#if release}
      <div>
        <h3>{release.title} {#if release.date}({release.date}){/if}</h3>
        <p>Artista: {song?.artist}</p>
        {#if coverUrl}
          <img src="{coverUrl}" alt="Carátula de {release.title}" />
        {:else}
          <p>Carátula no disponible</p>
        {/if}
      </div>
    {:else}
      <p>Cargando información...</p>
    {/if}
  {/if}
  