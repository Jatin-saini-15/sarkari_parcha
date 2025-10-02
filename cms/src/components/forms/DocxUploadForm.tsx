'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, FileText, Clock, Award, Minus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Section {
  name: string;
  duration?: number;
  totalMarks?: number;
}

interface Category {
  id: string;
  name: string;
  examNames: { id: string; name: string; }[];
}

export default function DocxUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [examNameId, setExamNameId] = useState('');
  const [duration, setDuration] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [negativeMarking, setNegativeMarking] = useState('');
  const [passingMarks, setPassingMarks] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isSectional, setIsSectional] = useState(false);

  useEffect(() => {
    // Fetch categories and exam names
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  const addSection = () => {
    setSections([...sections, { name: '', duration: undefined, totalMarks: undefined }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof Section, value: string | number) => {
    const updatedSections = [...sections];
    if (field === 'duration' || field === 'totalMarks') {
      updatedSections[index][field] = value as number;
    } else {
      updatedSections[index][field] = value as string;
    }
    setSections(updatedSections);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid DOCX file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !categoryId || !duration || !totalMarks) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('categoryId', categoryId);
      formData.append('examNameId', examNameId);
      formData.append('duration', duration);
      formData.append('totalMarks', totalMarks);
      formData.append('negativeMarking', negativeMarking);
      formData.append('passingMarks', passingMarks);
      formData.append('isFree', isFree.toString());
      formData.append('sections', JSON.stringify(sections));

      const response = await fetch('/api/docx-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadResult(result);
        // Reset form
        setFile(null);
        setTitle('');
        setCategoryId('');
        setExamNameId('');
        setDuration('');
        setTotalMarks('');
        setNegativeMarking('');
        setPassingMarks('');
        setIsFree(false);
        setSections([]);
        setIsSectional(false);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Mock Test (DOCX)
          </CardTitle>
          <CardDescription>
            Upload a DOCX file containing mock test questions. The system will automatically parse questions in the format: Q.1, Q.2, etc. with options a, b, c, d and answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">DOCX File *</Label>
              <Input
                id="file"
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., SSC CGL Mock Test 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Select value={examNameId} onValueChange={setExamNameId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam name" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.examNames.map((examName) => (
                      <SelectItem key={examName.id} value={examName.id}>
                        {examName.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="negativeMarking">Negative Marking</Label>
                <Input
                  id="negativeMarking"
                  type="number"
                  step="0.25"
                  value={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.value)}
                  placeholder="e.g., 0.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input
                  id="passingMarks"
                  type="number"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  placeholder="e.g., 40"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFree"
                  checked={isFree}
                  onCheckedChange={setIsFree}
                />
                <Label htmlFor="isFree">Free Test</Label>
              </div>
            </div>

            {/* Sectional Test Toggle */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isSectional"
                  checked={isSectional}
                  onCheckedChange={setIsSectional}
                />
                <Label htmlFor="isSectional">Create Sectional Test</Label>
              </div>

              {isSectional && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test Sections</CardTitle>
                    <CardDescription>
                      Define sections for your test. Questions will be automatically assigned to sections based on their content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Input
                            value={section.name}
                            onChange={(e) => updateSection(index, 'name', e.target.value)}
                            placeholder="Section name (e.g., English, Mathematics)"
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            value={section.duration || ''}
                            onChange={(e) => updateSection(index, 'duration', parseInt(e.target.value))}
                            placeholder="Duration (min)"
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            value={section.totalMarks || ''}
                            onChange={(e) => updateSection(index, 'totalMarks', parseInt(e.target.value))}
                            placeholder="Total marks"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSection}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload and Create Mock Test
                </>
              )}
            </Button>
          </form>

          {/* Upload Result */}
          {uploadResult && (
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Upload Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Test Title:</strong> {uploadResult.mockTest.title}</p>
                <p><strong>Questions Found:</strong> {uploadResult.mockTest.questionsCount}</p>
                <p><strong>Sections Created:</strong> {uploadResult.mockTest.sectionsCount}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {duration} minutes
                  </Badge>
                  <Badge variant="secondary">
                    <Award className="h-3 w-3 mr-1" />
                    {totalMarks} marks
                  </Badge>
                  {isFree && <Badge variant="outline">Free</Badge>}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}