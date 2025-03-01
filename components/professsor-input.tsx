import React, { useState, useEffect, useMemo } from "react";
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
  const [errors, setErrors] = useState<string[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [subjectFocusIndex, setSubjectFocusIndex] = useState(-1);
  const [labFocusIndex, setLabFocusIndex] = useState(-1);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/fetchData");
      const data = await res.json();
      setProfessors(data.professors || []);
      setYears(data.years || []);
      setIsDataLoading(false);
    };
    fetchData();
  }, []);

  // Updated helper functions for validation:
  const validateGeneralInput = (value: string) => {
    return value.replace(/[^a-zA-Z0-9 \-]/g, ""); // removes only invalid characters, now allows hyphen (-)
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
    newSubjects[index].code = validateGeneralInput(value).toUpperCase();
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
    newLabs[index].code = validateGeneralInput(value).toUpperCase();
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

    // Filter out empty subjects and labs
    const filteredSubjects = subjects.filter(
      (subject) => subject.code.trim() !== "" && subject.name.trim() !== ""
    );
    const filteredLabs = labs.filter(
      (lab) => lab.code.trim() !== "" && lab.name.trim() !== ""
    );

    const errorsLocal: string[] = [];

    // Check for duplicate employee code
    if (
      professors.some(
        (prof) =>
          prof.employeeCode.trim().toLowerCase() ===
          employeeCode.trim().toLowerCase()
      )
    ) {
      errorsLocal.push("A professor with this employee code already exists");
    }
    // Validate subjects exist (add error only once)
    if (
      filteredSubjects.some(
        (subject) =>
          !allSubjects.some(
            (s) => s.code === subject.code && s.name === subject.name
          )
      )
    ) {
      errorsLocal.push("Cannot assign a subject that doesnt exist");
    }
    // Validate labs exist (add error only once)
    if (
      filteredLabs.some(
        (lab) =>
          !allLabs.some((l) => l.code === lab.code && l.name === lab.name)
      )
    ) {
      errorsLocal.push("Cannot assign a lab that doesnt exist");
    }

    if (errorsLocal.length > 0) {
      setErrors(errorsLocal);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      employeeCode,
      ...(filteredSubjects.length > 0 && {
        subjects: filteredSubjects.map((subject) => ({
          code: subject.code,
          name: subject.name,
        })),
      }),
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
    setErrors([]);
    if (onSuccess) onSuccess();
  };

  // Flatten subjects and labs from 'years' state
  const allSubjects = useMemo(() => {
    const uniqueSubjects = new Set<string>();
    const list: SubjectField[] = [];
    years.forEach((y) => {
      y.sections.forEach((section) => {
        section.subjects.forEach((s) => {
          const key = `${s.code}-${s.name}`;
          if (!uniqueSubjects.has(key)) {
            uniqueSubjects.add(key);
            list.push({ code: s.code, name: s.name });
          }
        });
      });
    });
    return list;
  }, [years]);

  const allLabs = useMemo(() => {
    const uniqueLabs = new Set<string>();
    const list: LabField[] = [];
    years.forEach((y) => {
      y.sections.forEach((section) => {
        section.labs.forEach((l) => {
          const key = `${l.code}-${l.name}`;
          if (!uniqueLabs.has(key)) {
            uniqueLabs.add(key);
            list.push({ code: l.code, name: l.name });
          }
        });
      });
    });
    return list;
  }, [years]);

  // Real-time validations
  useEffect(() => {
    const errorsList: string[] = [];
    if (
      employeeCode.trim() !== "" &&
      professors.some(
        (prof) =>
          prof.employeeCode.trim().toLowerCase() ===
          employeeCode.trim().toLowerCase()
      )
    ) {
      errorsList.push("A professor with this employee code already exists");
    }
    const filteredSubjects = subjects.filter(
      (subject) => subject.code.trim() !== "" && subject.name.trim() !== ""
    );
    if (
      filteredSubjects.some(
        (subject) =>
          !allSubjects.some(
            (s) => s.code === subject.code && s.name === subject.name
          )
      )
    ) {
      errorsList.push("Cannot assign a subject that doesnt exist");
    }
    const filteredLabs = labs.filter(
      (lab) => lab.code.trim() !== "" && lab.name.trim() !== ""
    );
    if (
      filteredLabs.some(
        (lab) =>
          !allLabs.some((l) => l.code === lab.code && l.name === lab.name)
      )
    ) {
      errorsList.push("Cannot assign a lab that doesnt exist");
    }
    setErrors(errorsList);
  }, [employeeCode, subjects, labs, professors, allSubjects, allLabs]);

  // Modified helper functions for filtering suggestions
  const getFilteredSubjects = (subject: SubjectField, index: number) => {
    const inputCode = subject.code.trim().toLowerCase();
    const inputName = subject.name.trim().toLowerCase();

    // Build a set of already selected subject keys (excluding current field)
    const selectedSubjectKeys = new Set<string>();
    subjects.forEach((s, idx) => {
      if (idx !== index && s.code.trim() && s.name.trim()) {
        selectedSubjectKeys.add(
          s.code.trim().toLowerCase() + "-" + s.name.trim().toLowerCase()
        );
      }
    });

    if (inputCode && inputName) {
      const perfectMatch = allSubjects.filter(
        (item) =>
          item.code.toLowerCase() === inputCode &&
          item.name.toLowerCase() === inputName
      );
      if (perfectMatch.length) {
        return perfectMatch.filter(
          (item) =>
            !selectedSubjectKeys.has(
              item.code.toLowerCase() + "-" + item.name.toLowerCase()
            )
        );
      }
    }
    return allSubjects.filter((item) => {
      const matchCode = inputCode
        ? item.code.toLowerCase().includes(inputCode)
        : true;
      const matchName = inputName
        ? item.name.toLowerCase().includes(inputName)
        : true;
      return (
        matchCode &&
        matchName &&
        !selectedSubjectKeys.has(
          item.code.toLowerCase() + "-" + item.name.toLowerCase()
        )
      );
    });
  };

  const getFilteredLabs = (lab: LabField, index: number) => {
    const inputCode = lab.code.trim().toLowerCase();
    const inputName = lab.name.trim().toLowerCase();

    // Build a set of already selected lab keys (excluding current field)
    const selectedLabKeys = new Set<string>();
    labs.forEach((l, idx) => {
      if (idx !== index && l.code.trim() && l.name.trim()) {
        selectedLabKeys.add(
          l.code.trim().toLowerCase() + "-" + l.name.trim().toLowerCase()
        );
      }
    });

    if (inputCode && inputName) {
      const perfectMatch = allLabs.filter(
        (item) =>
          item.code.toLowerCase() === inputCode &&
          item.name.toLowerCase() === inputName
      );
      if (perfectMatch.length) {
        return perfectMatch.filter(
          (item) =>
            !selectedLabKeys.has(
              item.code.toLowerCase() + "-" + item.name.toLowerCase()
            )
        );
      }
    }
    return allLabs.filter((item) => {
      const matchCode = inputCode
        ? item.code.toLowerCase().includes(inputCode)
        : true;
      const matchName = inputName
        ? item.name.toLowerCase().includes(inputName)
        : true;
      return (
        matchCode &&
        matchName &&
        !selectedLabKeys.has(
          item.code.toLowerCase() + "-" + item.name.toLowerCase()
        )
      );
    });
  };

  return (
    <div>
      <div className=" space-y-2">
        <Input
          placeholder="Professor Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(validateGeneralInput(e.target.value))
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input max-w-sm"
        />
        <Input
          placeholder="Employee Code"
          value={employeeCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeCode(validateGeneralInput(e.target.value).toUpperCase())
          }
          onKeyDown={handleKeyDown}
          className="pbl-form-input max-w-sm"
        />
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-center gap-2">
        <Command className="subject-command rounded-lg border">
          <div className="flex items-center ">
            <CommandInput
              placeholder="Subject Code"
              value={subject.code}
              onValueChange={(value) =>
                handleSubjectCodeChange(index, value)
              }
              onKeyDown={handleKeyDown}
              onFocus={() => setSubjectFocusIndex(index)}
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
              onFocus={() => setSubjectFocusIndex(index)}
              className="pbl-form-input "
              data-group="subject-name"
            />
          </div>
          {(subjectFocusIndex === index ||
            subject.code ||
            subject.name) && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {getFilteredSubjects(subject, index).map((item) => (
                  <CommandItem
                    key={item.code}
                    value={`${item.name} ${item.code}`}
                    onSelect={() => {
                      handleSubjectCodeChange(index, item.code);
                      handleSubjectNameChange(index, item.name);
                    }}
                  >
                    {item.name} ({item.code})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
            <div className="flex items-center">
              {index === 0 ? (
                <Plus
                  className="ml-2 cursor-pointer"
                  onClick={addSubjectField}
                />
              ) : (
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
        <Command className="lab-command rounded-lg border">
          <div className="flex items-center ">
            <CommandInput
              placeholder="Lab Code"
              value={lab.code}
              onValueChange={(value) => handleLabCodeChange(index, value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setLabFocusIndex(index)}
              className="pbl-form-input"
              data-group="lab-code"
            />
            <CommandInput
              placeholder="Lab Name"
              value={lab.name}
              onValueChange={(value) => handleLabNameChange(index, value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setLabFocusIndex(index)}
              className="pbl-form-input "
              data-group="lab-name"
            />
          </div>
          {(labFocusIndex === index || lab.code || lab.name) && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {getFilteredLabs(lab, index).map((item) => (
                  <CommandItem
                    key={item.code}
                    value={`${item.name} ${item.code}`}
                    onSelect={() => {
                      handleLabCodeChange(index, item.code);
                      handleLabNameChange(index, item.name);
                    }}
                  >
                    {item.name} ({item.code})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
            <div className="flex items-center">
              {index === 0 ? (
                <Plus className="ml-2 cursor-pointer" onClick={addLabField} />
              ) : (
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
          className="pbl-form-input max-w-sm"
        />
        {errors.map((err, idx) => (
          <p key={idx} className="mb-2 text-red-600 text-sm">
            {err}
          </p>
        ))}
        <Button
          onClick={handleSubmit}
          disabled={errors.length > 0 || !isFormValid || isSubmitting}
          variant={errors.length > 0 || !isFormValid ? "secondary" : undefined}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ProfessorInput;
