"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Folder, PlusCircle } from "lucide-react";

export default function VocabularyApp() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddVocabForm, setShowAddVocabForm] = useState(false);
  const [newVocab, setNewVocab] = useState({
    word: "",
    partOfSpeech: "",
    ipa: "",
    meaning: "",
    example: "",
    audioUrl: "",
  });

  const [editingVocabId, setEditingVocabId] = useState(null);

  // Load folders
  useEffect(() => {
    fetch("/api/folders")
      .then((res) => res.json())
      .then(setFolders)
      .catch(console.error);
  }, []);

  // Select folder -> load vocabularies
  const handleSelectFolder = async (folder) => {
    setSelectedFolder(folder);
    setLoading(true);
    setShowAddVocabForm(false);
    try {
      const res = await fetch(`/api/folders/${folder.id}/vocabularies`);
      const data = await res.json();
      setVocabularies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add folder
  const handleAddFolder = async () => {
    const name = prompt("Enter new folder name:");
    if (!name) return;
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newFolder = await res.json();
    setFolders([...folders, newFolder]);
  };

  // Submit new vocabulary
  const handleAddVocabulary = async (e) => {
    e.preventDefault();
    if (!newVocab.word || !newVocab.meaning) {
      alert("Word and meaning are required.");
      return;
    }
  
    try {
      let res, savedVocab;
  
      if (editingVocabId) {
        // Update existing vocabulary
        res = await fetch(
          `/api/folders/${selectedFolder.id}/vocabularies/${editingVocabId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVocab),
          }
        );
        savedVocab = await res.json();
        // Cập nhật state vocabularies
        setVocabularies(
          vocabularies.map((v) => (v.id === savedVocab.id ? savedVocab : v))
        );
        setEditingVocabId(null);
      } else {
        // Create new vocabulary
        res = await fetch(`/api/folders/${selectedFolder.id}/vocabularies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVocab),
        });
        savedVocab = await res.json();
        setVocabularies([...vocabularies, savedVocab]);
      }
  
      // Reset form
      setNewVocab({
        word: "",
        partOfSpeech: "",
        ipa: "",
        meaning: "",
        example: "",
        audioUrl: "",
      });
      setShowAddVocabForm(false);
    } catch (err) {
      console.error(err);
      alert("Error saving vocabulary");
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-gray-300 dark:border-gray-700 bg-muted dark:bg-gray-900 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Vocabulary
          </h2>
          <Button variant="ghost" size="sm" onClick={handleAddFolder}>
            <PlusCircle className="w-4 h-4 text-green-600" />
          </Button>
        </div>

        <ul className="space-y-2">
          {folders.map((folder) => (
            <li key={folder.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  selectedFolder?.id === folder.id
                    ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleSelectFolder(folder)}
              >
                <Folder className="w-4 h-4 mr-2 text-blue-500" />
                {folder.name}
              </Button>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto bg-background text-foreground transition-colors duration-300">
        {!selectedFolder && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Select a folder to view vocabulary.
          </div>
        )}

        {selectedFolder && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                {selectedFolder.name}
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddVocabForm(!showAddVocabForm)}
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Vocabulary
              </Button>
            </div>

            {/* FORM ADD VOCABULARY */}
            {showAddVocabForm && (
              <form
                className="mb-6 p-4 border rounded-lg bg-card dark:bg-gray-800 border-gray-200 dark:border-gray-700 space-y-2"
                onSubmit={handleAddVocabulary}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="Word"
                    value={newVocab.word}
                    onChange={(e) =>
                      setNewVocab({ ...newVocab, word: e.target.value })
                    }
                    required
                  />

                  {/* Dropdown Part of Speech */}
                  <select
                    value={newVocab.partOfSpeech}
                    onChange={(e) =>
                      setNewVocab({ ...newVocab, partOfSpeech: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full bg-background dark:bg-gray-900"
                  >
                    <option value="">-- Select Part of Speech (optional) --</option>
                    <option value="noun">noun</option>
                    <option value="verb">verb</option>
                    <option value="adj">adjective</option>
                    <option value="adv">adverb</option>
                    <option value="pron">pronoun</option>
                    <option value="prep">preposition</option>
                    <option value="conj">conjunction</option>
                    <option value="interj">interjection</option>
                  </select>

                  <div className="flex gap-2 items-center">
  <Input
    placeholder="IPA"
    value={newVocab.ipa}
    onChange={(e) =>
      setNewVocab({ ...newVocab, ipa: e.target.value })
    }
  />
  <Button
    type="button"
    size="sm"
    onClick={async () => {
      if (!newVocab.word) return alert("Enter a word first!");
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${newVocab.word}`
        );
        if (!res.ok) return alert("Word not found in dictionary");
        const data = await res.json();
        const phonetics = data[0]?.phonetics || [];

        // Lấy IPA
        const ipaText = phonetics.find(p => p.text)?.text;
        if (!ipaText) return alert("IPA not available");
        setNewVocab({ ...newVocab, ipa: ipaText, audioUrl: phonetics.find(p => p.audio)?.audio || "" });
      } catch (err) {
        console.error(err);
        alert("Error fetching IPA");
      }
    }}
  >
    Generate IPA
  </Button>

  {/* Nút nghe thử âm thanh */}
  <Button
    type="button"
    size="sm"
    disabled={!newVocab.audioUrl}
    onClick={() => {
      if (!newVocab.audioUrl) return;
      const audio = new Audio(newVocab.audioUrl);
      audio.play();
    }}
  >
    🔊 Listen
  </Button>
</div>


                  <Input
                    placeholder="Meaning"
                    value={newVocab.meaning}
                    onChange={(e) =>
                      setNewVocab({ ...newVocab, meaning: e.target.value })
                    }
                    required
                  />
                </div>
                <Textarea
                  placeholder="Example sentence"
                  value={newVocab.example}
                  onChange={(e) =>
                    setNewVocab({ ...newVocab, example: e.target.value })
                  }
                />
                <Button type="submit">Add Vocabulary</Button>
              </form>
            )}

            {/* VOCABULARY LIST */}
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : vocabularies.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No vocabulary found.
              </p>
            ) : (
<AnimatePresence>
  <motion.div
    layout
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    {vocabularies.map((vocab) => (
      <motion.div
        key={vocab.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold mb-1">{vocab.word}</h3>
          {vocab.ipa && (
            <p className="text-sm text-blue-500 italic mb-1">/{vocab.ipa}/</p>
          )}
          <p className="text-sm mb-2">{vocab.meaning}</p>
          {vocab.example && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              “{vocab.example}”
            </p>
          )}
        </div>

        {/* Hàng nút thao tác */}
        <div className="flex gap-2 mt-2">
          {/* Nghe audio */}
          {vocab.audioUrl && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const audio = new Audio(vocab.audioUrl);
                audio.play();
              }}
            >
              🔊 Listen
            </Button>
          )}

          {/* Update */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              // Điền dữ liệu từ vào form add vocabulary để edit
              setShowAddVocabForm(true);
              setNewVocab({
                word: vocab.word,
                partOfSpeech: vocab.partOfSpeech || "",
                ipa: vocab.ipa || "",
                meaning: vocab.meaning,
                example: vocab.example || "",
                audioUrl: vocab.audioUrl || "",
              });
              // Lưu id để biết đang edit từ nào
              setEditingVocabId(vocab.id);
            }}
          >
            ✏️ Edit
          </Button>

          {/* Delete */}
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={async () => {
              if (!confirm(`Delete word "${vocab.word}"?`)) return;
              try {
                await fetch(`/api/folders/${selectedFolder.id}/vocabularies/${vocab.id}`, {
                  method: "DELETE",
                });
                setVocabularies(vocabularies.filter(v => v.id !== vocab.id));
              } catch (err) {
                console.error(err);
                alert("Error deleting word");
              }
            }}
          >
            🗑️ Delete
          </Button>
        </div>
      </motion.div>
    ))}
  </motion.div>
</AnimatePresence>

            )}
          </div>
        )}
      </main>
    </div>
  );
}
