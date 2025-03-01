import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus, X } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

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

interface Teacher {
   name: string;
  employeeCode: string;
  subjects?: { code: string; name: string }[];
  labs?: { code: string; name: string }[];
  workingHours: number;
}

interface Year {
   year: number;
  sections: {
    section: string;
    room: string;
    subjects: { code: string; name: string; credits: number }[];
    labs: { code: string; name: string; credits: number; hours: number }[];
  }[];
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
  const [professors, setProfessors] = useState<Teacher[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/fetchData");
      const data = await res.json();
      setProfessors(data.professors || []);
      setYears(data.years || []);
    };
    fetchData();
  }, []);

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
  const isFieldValid = (field: SubjectField | LabField) => {
    return (
      (field.code === "" && field.name === "") ||
      (field.code !== "" && field.name !== "")
    );
  };

  // Compute form validity: required fields must be non-empty (subjects and labs can be empty)
  const isFormValid =
    name.trim() !== "" &&
    employeeCode.trim() !== "" &&
    workingHours.trim() !== "" &&
    subjects.every(isFieldValid) &&
    labs.every(isFieldValid);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Filter out empty subjects (both code and name must be empty)
    const filteredSubjects = subjects.filter(
      (subject) => subject.code.trim() !== "" && subject.name.trim() !== ""
    );

    // Filter out empty labs (both code and name must be empty)
    const filteredLabs = labs.filter(
      (lab) => lab.code.trim() !== "" && lab.name.trim() !== ""
    );

    const payload = {
      name,
      employeeCode,
      // Only include subjects if there are non-empty entries
      ...(filteredSubjects.length > 0 && {
        subjects: filteredSubjects.map((subject) => ({
          code: subject.code,
          name: subject.name,
        })),
      }),
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(validateGeneralInput(e.target.value))
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        <Input
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeCode(validateGeneralInput(e.target.value))
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-center gap-2">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <div className="flex items-center ">
            <CommandInput
              placeholder="Subject Code"
              value={subject.code}
              onValueChange={(value) =>
                handleSubjectCodeChange(index, value)
              }
              onKeyDown={handleKeyDown}
              className="pbl-form-input "
              data-group="subject-code"
            />
            <CommandInput
              placeholder="Subject Name"
              value={subject.name}
              onValueChange={(value) =>
                handleSubjectNameChange(index, value)
              }
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="subject-name"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
            <div className="flex items-center">
              {index == 0 && (
                <Plus
                  className="ml-2 cursor-pointer"
                  onClick={addSubjectField}
                />
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
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <div className="flex items-center ">
            <CommandInput
              placeholder="Lab Code"
              value={lab.code}
              onValueChange={(value) => handleLabCodeChange(index, value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input"
              data-group="lab-code"
            />
            <CommandInput
              placeholder="Lab Name"
              value={lab.name}
              onValueChange={(value) => handleLabNameChange(index, value)}
              onKeyDown={handleKeyDown}
              className="pbl-form-input "
              data-group="lab-name"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWorkingHours(validateNumberInput(e.target.value))
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
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
