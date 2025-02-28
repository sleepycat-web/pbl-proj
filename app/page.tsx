"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import SubjectInput from "@/components/ui/subject-input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProfessorInput from "@/components/ui/professsor-input";

interface Subject {
  code: string;
  name: string;
  credits: number;
}

interface Lab {
  code: string;
  name: string;
  credits: number;
  hours: number;
}

interface Section {
  section: string;
  subjects: Subject[];
  labs: Lab[];
}

interface Year {
  year: number;
  sections: Section[];
}

// Update Professor interface
interface Professor {
  _id: { $oid: string };
  name: string;
  subjects: { code: string; name: string }[];
  labs?: { code: string; name: string }[]; // labs now as objects
  workingHours: number;
  employeeCode: string;
}

interface CourseData {
  years: Year[];
  professors: Professor[];
}

const CoursePage = () => {
  const [data, setData] = useState<CourseData>({ years: [], professors: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("years"); // new state

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchData");
      const result = await response.json();
      setData(result as CourseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Course Information</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {" "}
        {/* modified Tabs */}
        <TabsList>
          <TabsTrigger value="years">Years</TabsTrigger>
          <TabsTrigger value="professors">Professors</TabsTrigger>
          <TabsTrigger value="add professor">Add Professor</TabsTrigger>
          <TabsTrigger value="add subject">Add Subject</TabsTrigger>
          <TabsTrigger value="time tables">Time Tables</TabsTrigger>
        </TabsList>
        <Button className="ml-2">Generate Time Tables</Button>
        {loading ? (
          <div className="flex justify-center mt-4">
            <Loader2 size="36" className="animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="years">
              {data.years.map((year) => (
                <Accordion
                  type="single"
                  collapsible
                  key={year.year}
                  className=""
                >
                  <AccordionItem value={`year-${year.year}`}>
                    <AccordionTrigger className="bg-neutral-900 px-4 rounded mb-2">
                      Year {year.year}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {year.sections.map((section) => (
                          <Card key={section.section} className="mb-4  ">
                            <CardHeader>
                              <CardTitle>Section {section.section}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <h4 className="font-semibold mb-2">Subjects:</h4>
                              <ul>
                                {section.subjects.map((subject) => (
                                  <li key={subject.code}>
                                    {subject.name} ({subject.code})
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-semibold mt-4 mb-2">Labs:</h4>
                              <ul>
                                {section.labs.map((lab) => (
                                  <li key={lab.code}>
                                    {lab.name} ({lab.code})
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </TabsContent>
            <TabsContent value="professors">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.professors.map((professor) => (
                  <Card key={professor._id.$oid}>
                    <CardHeader>
                      <CardTitle>{professor.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Employee Code:</strong> {professor.employeeCode}
                      </p>
                      <p>
                        <strong>Subjects:</strong>{" "}
                        {professor.subjects
                          .map((subject) => `${subject.name} (${subject.code})`)
                          .join(", ")}
                      </p>
                      {professor.labs && professor.labs.length > 0 && (
                        <p>
                          <strong>Labs:</strong>{" "}
                          {professor.labs
                            .map((lab) => `${lab.name} (${lab.code})`)
                            .join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Working Hours:</strong> {professor.workingHours}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="add professor">
              <ProfessorInput
                onSuccess={async () => {
                  await loadData();
                  setActiveTab("professors");
                }}
              />
            </TabsContent>
            <TabsContent value="add subject">
              <SubjectInput />
            </TabsContent>
            <TabsContent value="time tables">Test</TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default CoursePage;
