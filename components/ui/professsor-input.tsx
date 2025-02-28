import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { Loader2, Plus, X } from "lucide-react";

interface ProfessorInputProps {
  onSuccess?: () => void;
}

interface SubjectField {
  code: string;
  name: string;
}

interface LabField {
  code: string;
  name: string;
}

const ProfessorInput = ({ onSuccess }: ProfessorInputProps) => {
  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [subjects, setSubjects] = useState<SubjectField[]>([
    { code: "", name: "" },
  ]);
  const [labs, setLabs] = useState<LabField[]>([{ code: "", name: "" }]);
  const [workingHours, setWorkingHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated helper functions for validation:
  const validateGeneralInput = (value: string) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, ""); // removes only invalid characters
  };

  const validateNumberInput = (value: string) => {
    return value.replace(/[^0-9]/g, ""); // removes only non-digit characters
  };

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
    setSubjects([...subjects, { code: "", name: "" }]);
    // Focus the new subject input after state updates
    setTimeout(() => {
      const subjectInputs = document.querySelectorAll(
        'input[data-group="subject-code"]'
      );
      if (subjectInputs.length) {
        (subjectInputs[subjectInputs.length - 1] as HTMLInputElement).focus();
      }
    }, 0);
  };

  const removeSubjectField = (indexToRemove: number) => {
    setSubjects(subjects.filter((_, index) => index !== indexToRemove));
  };

  const handleSubjectCodeChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].code = validateGeneralInput(value);
    setSubjects(newSubjects);
  };

  const handleSubjectNameChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].name = validateGeneralInput(value);
    setSubjects(newSubjects);
  };

  const addLabField = () => {
    setLabs([...labs, { code: "", name: "" }]);
    // Focus the new lab input after state updates
    setTimeout(() => {
      const labInputs = document.querySelectorAll(
        'input[data-group="lab-code"]'
      );
      if (labInputs.length) {
        (labInputs[labInputs.length - 1] as HTMLInputElement).focus();
      }
    }, 0);
  };

  const removeLabField = (indexToRemove: number) => {
    setLabs(labs.filter((_, index) => index !== indexToRemove));
  };

  const handleLabCodeChange = (index: number, value: string) => {
    const newLabs = [...labs];
    newLabs[index].code = validateGeneralInput(value);
    setLabs(newLabs);
  };

  const handleLabNameChange = (index: number, value: string) => {
    const newLabs = [...labs];
    newLabs[index].name = validateGeneralInput(value);
    setLabs(newLabs);
  };

  const resetForm = () => {
    setName("");
    setEmployeeCode("");
    setSubjects([{ code: "", name: "" }]);
    setLabs([{ code: "", name: "" }]);
    setWorkingHours("");
  };

  // Validate if both code and name are either both filled or both empty
  const isLabValid = (lab: LabField) => {
    return (
      (lab.code === "" && lab.name === "") ||
      (lab.code !== "" && lab.name !== "")
    );
  };

  // Compute form validity: required fields must be non-empty (labs can be empty)
  const isFormValid =
    name.trim() !== "" &&
    employeeCode.trim() !== "" &&
    workingHours.trim() !== "" &&
    subjects.every(
      (subject) => subject.code.trim() !== "" && subject.name.trim() !== ""
    ) &&
    labs.every(isLabValid);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Filter out empty labs (both code and name must be empty)
    const filteredLabs = labs.filter(
      (lab) => lab.code.trim() !== "" && lab.name.trim() !== ""
    );

    const payload = {
      name,
      employeeCode,
      subjects: subjects.map((subject) => ({
        code: subject.code,
        name: subject.name,
      })),
      // Only include labs if there are non-empty entries
      ...(filteredLabs.length > 0 && {
        labs: filteredLabs.map((lab) => ({
          code: lab.code,
          name: lab.name,
        })),
      }),
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
          onChange={(e) => setName(validateGeneralInput(e.target.value))}
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        <Input
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e) =>
            setEmployeeCode(validateGeneralInput(e.target.value))
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Subject Code"
              value={subject.code}
              onChange={(e) => handleSubjectCodeChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="subject-code"
            />
            <Input
              placeholder="Subject Name"
              value={subject.name}
              onChange={(e) => handleSubjectNameChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="subject-name"
            />
            <div className="flex items-center">
              {index == 0 && (
                <Plus className="ml-2 cursor-pointer" onClick={addSubjectField} />
              )}
              {index !== 0 && (
                <X
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => removeSubjectField(index)}
                />
              )}
            </div>
          </div>
        ))}
        {labs.map((lab, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Lab Code"
              value={lab.code}
              onChange={(e) => handleLabCodeChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="lab-code"
            />
            <Input
              placeholder="Lab Name"
              value={lab.name}
              onChange={(e) => handleLabNameChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="lab-name"
            />
            <div className="flex items-center">
              {index == 0 && (
                <Plus className="ml-2 cursor-pointer" onClick={addLabField} />
              )}
              {index !== 0 && (
                <X
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => removeLabField(index)}
                />
              )}
            </div>
          </div>
        ))}
        <Input
          placeholder="Working Hours"
          value={workingHours}
          onChange={(e) => setWorkingHours(validateNumberInput(e.target.value))}
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          variant={isFormValid ? undefined : "secondary"}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ProfessorInput;
