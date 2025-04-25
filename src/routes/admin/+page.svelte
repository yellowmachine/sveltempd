<script lang="ts">
	import Admin from "$lib/components/Admin.svelte";
    export let data;

</script>

<Admin data={data.db.admin} />