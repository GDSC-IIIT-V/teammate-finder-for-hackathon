import shipnav.Cost
from shipnav.Cost import env_factors
# import Cost
# from Cost import env_factors
import sys
class Node:
    def __init__(self,coord,hs=0,g=float('inf'),rhs=float('inf'),flag="nochange"):
        self.lat=coord[0]
        self.lon=coord[1]
        self.coord=coord
        """
        old and new values
        """
        self.hs=[hs,hs]
        self.g=g
        self.rhs=rhs  
    def __hash__(self):
        return hash((self.lat, self.lon))
    def __eq__(self,other):
        if other==None:
            return False
        if(self.lat==other.lat and self.lon==other.lon):
            return True
        return False
            
class Graph:
    def __init__(self):  
        self.adjlist = {}#contains node type as keys and node types as values
        self.nodelist= {}#contains coordinates as keys as node type as values

    def get_node(self, coord): 
        """coordinates are tuples
         containing lat and lon"""
        coord = tuple(coord)
        if not self.nodelist.get(coord):
            return None
        
        return self.nodelist[coord]

    def get_adjnodes(self,coord): 
        """coordinates are tuples 
        converted into node types to fetch,
        corresponding adjacent nodes"""
        node= self.get_node(coord)
        return self.adjlist[node]

    def add_edge(self, s, d):
        #update the node list
        if(self.adjlist.get(d)==None):
            self.adjlist[d]=set()
        if(self.adjlist.get(s)==None):
            self.adjlist[s]=set()
        self.adjlist[s].add(d)
        self.adjlist[d].add(s)

    def add_node(self, node):
        #no need to check if it exists in list already as that node is just created.
        self.nodelist[node.coord]=node

    def print_graph(self):
        for i in self.adjlist:
            print("Vertex " + str(i) + ":", end="")
            temp = self.adjlist[i]
            for j in temp:
                print(" "+str(j)+" ", end="")
            print(" \n")

class GraphBuilder:
    
    def __init__(self,g_type,nghbr_type,node_list=[]):
        self.g_type=g_type
        self.nghbr_type=nghbr_type
        self.node_list=[]
        self.graph = Graph()
        self.avg_hs= env_factors().avg_hs()        #gets avg_hs
        
        if g_type=="full":
            print("full")
            for i in range(-70,71):#will be changed to -70 to 71
                for j in range(0,360):#will be changed to 0 to 360 #as of now considering only smaller graph
                    if(self.check_pair([i,j])):
                        node=self.graph.get_node((i,j))
                        if not node:
                            node= Node((i,j),self.avg_hs[70+i][j]) #create only if its not present already
                            self.graph.add_node(node)
                        if(node.hs[0]<0):
                            continue

                        possibilities=self.possibs(i,j,nghbr_type)
                        """
                        when dealing with higher neighbour type graphs,
                        data with greater resolution is imp. As in higher
                        ntypes graph nodes are connected with one line, they
                        pass through other node's area in the process. So 
                        it becomes necessary to check the nodes the connected
                        line is passing thru and check bathymetry inf like 
                        depth, land/water , international border etc to 
                        judge if the connection is valid.
                        So if the resolution is low and u dont do a proper
                        check, you might end up planning the path through the land.
                        """
                        for pair in possibilities:
                            if(self.check_pair(pair)):
                                flag=0
                                s=node.coord
                                d=pair
                                dy=d[1]-s[1] #if dy=0 that means there are no vcuts
                                dx=d[0]-s[0]
                                if (nghbr_type>=2 and ((abs(dy)+abs(dx))>2)):
                                    flag= self.check_connectivity(s,d)

                                n_node=self.graph.get_node(pair)
                                if not n_node:
                                    n_node= Node(pair,self.avg_hs[70+pair[0]][pair[1]]) #create only if its not present already
                                    self.graph.add_node(n_node)
                                ##print(type(node))
                                if flag==0:
                                    self.graph.add_edge(n_node,node)
        elif g_type=="part": 
            #check node list and make sure a graph is being built on that node list only
            #assuming no repetitions in the node list sent
            #only accepting tuples as coords or can send node types
            print(node_list)
            if type(node_list[0])==tuple:
                
                """
                converting into a list of node types
                """
                node_list=[Node(i,self.avg_hs[70+i[0]][i[1]]) for i in node_list]
                for i in node_list:
                    self.graph.add_node(i)
                
            """
            need to check the error
            """
            
            """made sure that list include only node types"""
            neighbours_of_pathnodes=set()
            for i in node_list:
                for j in self.possibs(i.lat,i.lon,nghbr_type):
                    if self.check_pair(j):
                        if not self.graph.get_node(j):
                            node= Node(j,hs=self.avg_hs[70+j[0]][j[1]])
                            self.graph.add_node(node)
                            neighbours_of_pathnodes.add(node)

                        """
                        checking connectivity
                        """
                        flag=0
                        s=i.coord
                        d=j
                        dy=d[1]-s[1] #if dy=0 that means there are no vcuts
                        dx=d[0]-s[0]
                        if (nghbr_type>=2 and ((abs(dy)+abs(dx))>2)):
                            flag= self.check_connectivity(s,d)
                        if flag==0:
                            self.graph.add_edge(i,self.graph.get_node(j))
                        
            
            """establishing connectivity between neighbours"""
            for i in neighbours_of_pathnodes:
                
                for j in self.possibs(i.lat,i.lon,nghbr_type):
                    """necessary to be created before, no new nodes now"""
                    if (self.graph.get_node(j)!=None):
                        flag=0
                        """
                        checking connectivity
                        """
                        s=i.coord
                        d=j
                        dy=d[1]-s[1] #if dy=0 that means there are no vcuts
                        dx=d[0]-s[0]
                        if (nghbr_type>=2 and ((abs(dy)+abs(dx))>2)):
                            flag= self.check_connectivity(s,d)
                        if flag==0:
                            self.graph.add_edge(i,self.graph.get_node(j))
            

            # node_list=list(set(node_list+list(neighbours_of_pathnodes)))

            # ##print(node_list)
            # for i in node_list: 
            #     if self.check_pair(i.coord):
            #         possibilities= self.possibs(i.lat,i.lon,nghbr_type)
            #     node=i
            #     #print("coord:",i.coord)
            #     #print("neighbours:",possibilities)
            #     for pair in possibilities:
            #         ##print(pair)
            #         if(self.check_pair(pair)  and self.graph.get_node(pair)):
            #             n_node=self.graph.get_node(pair)
            #             #if not n_node:
            #                 #n_node= Node(pair,self.avg_hs[70+node.lat][node.lon]) #create only if its not present already
            #                 #self.graph.add_node(n_node)
            #             self.graph.add_edge(n_node,node)

        


    def checkcoprime(self, a, b):
        if (a == 0 or b == 0): return 0
        if (a == b): return a==1
        if (a > b): return self.checkcoprime(a-b, b)
        return self.checkcoprime(a, b-a)

    def permuts(self,j,i):
        li=set()
        for s in [-1,1]:
            li.update({(j*s,i),(i*s,j),(j,i*s),(i,j*s),(i*s,j*s),(j*s,i*s)})
        return list(li)

    def neighbours(self,n):   
        all_neighbours=[[(0, 1), (-1, 0), (1, 0), (0, -1)]]
        for i in range(1,n+1):
            block=[]
            for j in range(0,i+1):
                if(self.checkcoprime(j,i)):
                    block.append(self.permuts(j,i))
            block=sum(block,[])  
            all_neighbours.append(block)
        all_neighbours=sum(all_neighbours,[])
        return all_neighbours
    
    def possibs(self,i,j,n):
        li=[]
        neighs=self.neighbours(n)
        for c in neighs:
            li.append((c[0]+i,c[1]+j))
        return li
    
    def check_pair(self,pair):
        # print(pair)
        # print(type(pair))
        # print(type(pair[0]))
        if(pair[0]<=70 and pair[0]>=-70):
            if(pair[1]>=0 and pair[1]<360 and self.avg_hs[70+pair[0]][pair[1]]>=0):
                return True
                
        return False

    def check_connectivity(self,s,d):
        flag=0
        dy=d[1]-s[1] #if dy=0 that means there are no vcuts
        dx=d[0]-s[0]
        vcuts=[i+0.5 for i in range(min(s[0],d[0]),max(s[0],d[0]))]#x
        hcuts=[i+0.5 for i in range(min(s[1],d[1]),max(s[1],d[1]))]#y
        #there might be a intersection point cut, as we are considering 
        #pixels and centre of them as position of vessel, 
            #if dx=0 that means there are no hcuts
        slope=dy/dx
        if dy>0 and dx>0:
            movement=[1,1]
        elif dy>0 and dx<0:
            movement=[-1,1]
        elif dy<0 and dx<0:
            movement=[-1,-1]
        else:
            movement=[1,-1]

        li = [[(x,slope*(x-s[0])+s[1]),(slope*(x-s[0])+s[1])**2+x*x,'v'] for x in vcuts]#dist from source
        li=li+[[((y-s[1])/slope+s[0],y),((y-s[1])/slope+s[0])**2+y*y,'h'] for y in hcuts]
        li=sorted(li, key=lambda x: x[1])
        points=[]
        temp=list(s)
        for k in li:
            if(k[2]=='h'):
                points.append([temp[0],temp[1]+movement[1]])
                temp[1]=temp[1]+movement[1]
            if(k[2]=='v'):
                points.append([temp[0]+movement[0],temp[1]])
                temp[0]=temp[0]+movement[0]
        
        for m in points:
            if not self.check_pair(m):
                flag=1
                break

        return flag



#testing
# pathlist=[(16,70),(15,71),(14,72),(13,73),(12,74),(11,75),(10,76),(9,76),(8,77),(8,78),(9,79),(10,80),(10,81),(10,82),(10,83)]

# # #graph = GraphBuilder("full",1).graph
# graph  = GraphBuilder("part",3,pathlist).graph

# #print("#printing neighbours of 10,80")

# # neigh_list=graph.adjlist[graph.get_node((16,72))]
# # print("length of list:",len(neigh_list))
# # for i in neigh_list:
# #     print(i.lat, i.lon)

# import matplotlib.pyplot as plt

# a = range(40,85,1)
# b= range(0,30,1)
# fig, ax = plt.subplots()
# for i in b:
#     for j in a:
#         #plt.plot
#         if(env_factors().avg_hs()[i+70][j]<=0):
#             ax.plot(j,i,'yo')
#         elif(graph.nodelist.get((i,j))):
#             ax.plot(j,i,'ro')
#         else:
#             ax.plot(j,i,'bo')
            

# for pair in pathlist:
#     ax.plot(pair[1],pair[0],'go', markersize=6)
# plt.show()
# # # graph=GraphBuilder("full",2).graph
# # # test2=graph.get_node((0,0))
# # # #print(test2.hs)