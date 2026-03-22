import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function RichEditor({ value, onChange, placeholder }) {
  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Matn kiriting..."}
      />
    </div>
  );
}
