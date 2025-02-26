import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { Loader2, Plus } from "lucide-react";

interface ProfessorInputProps {
  onSuccess?: () => void;
}

const ProfessorInput = ({ onSuccess }: ProfessorInputProps) => {
  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [subjects, setSubjects] = useState([""]);
  const [labs, setLabs] = useState([""]);
  const [workingHours, setWorkingHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New function to handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const inputs = document.querySelectorAll(".pbl-form-input");
      const arr = Array.from(inputs);
      const currentIndex = arr.indexOf(e.currentTarget);
      if (currentIndex >= 0 && currentIndex < arr.length - 1) {
        (arr[currentIndex + 1] as HTMLInputElement).focus();
      }
    }
  };

  const addSubjectField = () => {
    setSubjects([...subjects, ""]);
    // Focus the new subject input after state updates
    setTimeout(() => {
      const subjectInputs = document.querySelectorAll(
        'input[data-group="subject"]'
      );
      if (subjectInputs.length) {
        (subjectInputs[subjectInputs.length - 1] as HTMLInputElement).focus();
      }
    }, 0);
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const addLabField = () => {
    setLabs([...labs, ""]);
    // Focus the new lab input after state updates
    setTimeout(() => {
      const labInputs = document.querySelectorAll('input[data-group="lab"]');
      if (labInputs.length) {
        (labInputs[labInputs.length - 1] as HTMLInputElement).focus();
      }
    }, 0);
  };

  const handleLabChange = (index: number, value: string) => {
    const newLabs = [...labs];
    newLabs[index] = value;
    setLabs(newLabs);
  };

  const resetForm = () => {
    setName("");
    setEmployeeCode("");
    setSubjects([""]);
    setLabs([""]);
    setWorkingHours("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      name,
      employeeCode,
      subjects,
      labs,
      workingHours: parseInt(workingHours, 10),
    };
    await fetch("/api/submitProfessor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setIsSubmitting(false);
    resetForm();
    if (onSuccess) onSuccess();
  };

  return (
    <div>
      <div className="max-w-sm space-y-2">
        <Input
          placeholder="Professor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        <Input
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-center">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => handleSubjectChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="subject"
            />
            {index === subjects.length - 1 && (
              <Plus className="ml-2 cursor-pointer" onClick={addSubjectField} />
            )}
          </div>
        ))}
        {labs.map((lab, index) => (
          <div key={index} className="flex items-center">
            <Input
              placeholder="Lab"
              value={lab}
              onChange={(e) => handleLabChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="lab"
            />
            {index === labs.length - 1 && (
              <Plus className="ml-2 cursor-pointer" onClick={addLabField} />
            )}
          </div>
        ))}
        <Input
          placeholder="Working Hours"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ProfessorInput;
