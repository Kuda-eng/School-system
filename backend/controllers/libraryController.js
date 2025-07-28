const LibraryItem = require('../models/Library');

// Upload a new book or syllabus
const uploadLibraryItem = async (req, res) => {
  try {
    const { title, description, subject, grade, fileUrl, isSyllabus } = req.body;

    const newItem = new LibraryItem({
      title,
      description,
      subject,
      grade,
      fileUrl,
      isSyllabus,
      uploadedBy: req.user?.id || null
    });

    await newItem.save();
    res.status(201).json({ message: '📚 Upload successful!', item: newItem });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: '❌ Upload failed.' });
  }
};

// Get all books/syllabuses
const getLibraryItems = async (req, res) => {
  try {
    const { grade, subject, isSyllabus } = req.query;
    const query = {};

    if (grade) query.grade = grade;
    if (subject) query.subject = new RegExp(subject, 'i');
    if (isSyllabus !== undefined) query.isSyllabus = isSyllabus;

    const items = await LibraryItem.find(query).sort({ uploadedAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: '❌ Failed to fetch resources.' });
  }
};

// Delete a book/syllabus
const deleteLibraryItem = async (req, res) => {
  try {
    await LibraryItem.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Item deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: '❌ Failed to delete item' });
  }
};

module.exports = {
  uploadLibraryItem,
  getLibraryItems,
  deleteLibraryItem
};
