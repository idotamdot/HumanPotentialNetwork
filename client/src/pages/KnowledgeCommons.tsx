import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KnowledgeCommons() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Knowledge Commons</h1>
        <p className="mt-2 text-gray-600">
          Shared resources, insights and findings from Human Potential Network projects.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="flex-1">
            <Input 
              placeholder="Search the knowledge commons..."
              className="w-full"
            />
          </div>
          <Button>Search</Button>
        </div>

        <Tabs defaultValue="resources">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="project-outcomes">Project Outcomes</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">PDF Guide</Badge>
                  <CardTitle className="text-lg">Building Sustainable Urban Gardens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    A comprehensive guide to creating and maintaining community gardens in urban spaces.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Contributed by Urban Garden Network</p>
                      <p>Downloaded 2,345 times</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">Tutorial Series</Badge>
                  <CardTitle className="text-lg">Data Visualization for Climate Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn to create compelling visualizations that communicate climate data effectively.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Contributed by Climate Tech Alliance</p>
                      <p>6 videos, 3.5 hours total</p>
                    </div>
                    <Button variant="outline" size="sm">Start Learning</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2">Toolkit</Badge>
                  <CardTitle className="text-lg">Digital Literacy Teaching Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ready-to-use materials for teaching basic computer skills to beginners of all ages.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Contributed by Digital Literacy Program</p>
                      <p>12 lesson plans, 25 worksheets</p>
                    </div>
                    <Button variant="outline" size="sm">Access</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="project-outcomes" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="sm:flex items-start">
                    <div className="mb-4 sm:mb-0 sm:mr-6 sm:w-1/3">
                      <Badge className="mb-2" variant="outline">Completed Project</Badge>
                      <h3 className="text-lg font-medium mb-1">Clean Water Initiative in Rural India</h3>
                      <p className="text-sm text-gray-500 mb-2">March 2023 - December 2023</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Clean Water</Badge>
                        <Badge variant="outline">High Impact</Badge>
                      </div>
                    </div>
                    <div className="sm:w-2/3">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Key Outcomes:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Installed 25 water purification systems serving 15,000 people</li>
                          <li>Reduced waterborne illness cases by 65% in target villages</li>
                          <li>Trained 40 local technicians in system maintenance</li>
                          <li>Created sustainable financial model for ongoing operations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Lessons Learned:</h4>
                        <p className="text-gray-600 mb-3">
                          Community involvement from the earliest planning stages was critical to success. 
                          Future projects should allocate more time for community engagement before technical implementation.
                        </p>
                        <Button variant="outline" size="sm">Read Full Report</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="sm:flex items-start">
                    <div className="mb-4 sm:mb-0 sm:mr-6 sm:w-1/3">
                      <Badge className="mb-2" variant="outline">Completed Project</Badge>
                      <h3 className="text-lg font-medium mb-1">Urban STEM Education Program</h3>
                      <p className="text-sm text-gray-500 mb-2">January 2023 - November 2023</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Education</Badge>
                        <Badge variant="outline">Technology</Badge>
                      </div>
                    </div>
                    <div className="sm:w-2/3">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Key Outcomes:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Engaged 1,200 students from underserved schools</li>
                          <li>Improved STEM test scores by average of 28%</li>
                          <li>Created online platform with 50+ learning modules</li>
                          <li>Established ongoing mentorship program with tech professionals</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Lessons Learned:</h4>
                        <p className="text-gray-600 mb-3">
                          Teacher training was as important as student resources. Future iterations should 
                          double the time allocated for teacher professional development.
                        </p>
                        <Button variant="outline" size="sm">Read Full Report</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="outline">Self-paced Course</Badge>
                  <CardTitle className="text-lg">Introduction to Climate Science</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn the fundamentals of climate science and the latest research on global climate change.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>8 modules • 4-6 hours</p>
                      <p>2,156 learners enrolled</p>
                    </div>
                    <Button size="sm">Enroll</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="outline">Workshop Series</Badge>
                  <CardTitle className="text-lg">Community Organizing Fundamentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Practical skills for mobilizing communities and building effective grassroots movements.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>6 sessions • Live online</p>
                      <p>Next cohort: May 15, 2023</p>
                    </div>
                    <Button size="sm">Register</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="outline">Certification</Badge>
                  <CardTitle className="text-lg">Sustainable Project Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn to manage projects with environmental and social sustainability at the core.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>12 modules • 20 hours</p>
                      <p>Includes portfolio project</p>
                    </div>
                    <Button size="sm">Enroll</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Open Discussions</h3>
                    <p className="text-gray-600">
                      Join in-depth conversations on key topics related to human potential and global challenges.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">The Future of Renewable Energy in Developing Nations</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-gray-600 mt-1 mb-2">
                        Discussing practical approaches to renewable energy adoption in resource-constrained settings.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>42 participants • 128 replies • Last activity: 2 hours ago</span>
                        </div>
                        <Button variant="outline" size="sm">Join Discussion</Button>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Measuring Project Impact: Beyond the Numbers</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-gray-600 mt-1 mb-2">
                        How can we effectively measure qualitative impact alongside quantitative metrics?
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>28 participants • 76 replies • Last activity: 1 day ago</span>
                        </div>
                        <Button variant="outline" size="sm">Join Discussion</Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium">Building Cross-Cultural Teams for Global Challenges</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-gray-600 mt-1 mb-2">
                        Strategies for effective collaboration across cultural, linguistic, and geographic boundaries.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>36 participants • 92 replies • Last activity: 5 hours ago</span>
                        </div>
                        <Button variant="outline" size="sm">Join Discussion</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
