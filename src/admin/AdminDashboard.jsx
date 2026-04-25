const [banners, setBanners] = useState([]);
const [editingBanner, setEditingBanner] = useState(false);
const [newBannerFile, setNewBannerFile] = useState(null);

useEffect(() => {
  loadBanners();
}, []);

async function loadBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: true });

  if (!error) setBanners(data || []);
}

async function deleteBanner(id) {
  await supabase.from("banners").delete().eq("id", id);
  loadBanners();
}

async function uploadBanner() {
  if (!newBannerFile) return;

  const fileName = `${Date.now()}-${newBannerFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("posters")
    .upload(fileName, newBannerFile);

  if (uploadError) {
    alert("Upload failed");
    return;
  }

  const { data } = supabase.storage
    .from("posters")
    .getPublicUrl(fileName);

  await supabase.from("banners").insert([
    {
      file_url: data.publicUrl,
      file_type: newBannerFile.type
    }
  ]);

  setNewBannerFile(null);
  loadBanners();
}

<div style={styles.card}>
  <h2>Home Banner</h2>

  {!editingBanner ? (
    <button
      style={styles.button}
      onClick={() => setEditingBanner(true)}
    >
      Edit
    </button>
  ) : (
    <>
      {/* EXISTING FILES */}
      {banners.map((item) => (
        <div key={item.id} style={{ marginTop: "10px" }}>
          <p style={styles.preview}>{item.file_url.split("/").pop()}</p>

          <button
            style={styles.deleteButton}
            onClick={() => deleteBanner(item.id)}
          >
            Delete
          </button>
        </div>
      ))}

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*,video/mp4"
        onChange={(e) => setNewBannerFile(e.target.files[0])}
      />

      {newBannerFile && (
        <p style={styles.preview}>{newBannerFile.name}</p>
      )}

      <div style={styles.buttonRow}>
        <button
          style={styles.button}
          onClick={async () => {
            if (!newBannerFile) return;

            const fileName = `${Date.now()}-${newBannerFile.name}`;

            await supabase.storage
              .from("posters")
              .upload(fileName, newBannerFile);

            const { data } = supabase.storage
              .from("posters")
              .getPublicUrl(fileName);

            await supabase.from("banners").insert([
              {
                file_url: data.publicUrl,
                file_type: newBannerFile.type,
                file_name: newBannerFile.name
              }
            ]);

            setNewBannerFile(null);
            loadBanners();
          }}
        >
          Go Live
        </button>

        <button
          style={styles.close}
          onClick={() => setEditingBanner(false)}
        >
          Close
        </button>
      </div>
    </>
  )}
</div>