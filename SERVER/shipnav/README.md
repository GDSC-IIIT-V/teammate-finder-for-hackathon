#shipnav2

#things asked by iiit by next week

1) working of d star lite algorithm
2) more test cases
3) look for interpolation (suggested for integrating proposed neighbourhood definition)



####code for checking rhs values of a test map prints it in a grid
wrote here for a case 10,75 to 15,70
for it in range(10,16):
    for jt in range(75,69,-1):
        try:
            number=graph.get_node((it,jt)).rhs
            if(number==float('inf')):raise EOFError
            print(f"{number:.2f}",end="  ")
        except:
            print("inf",end="     ")
    print('\n')



#########result grid of rhs values

927.49  882.48  927.49  inf     inf     inf     

881.16  746.46  701.71  658.77  703.52  inf     

927.24  700.00  563.77  519.31  476.33  520.79  

inf     654.21  517.16  378.45  334.29  290.89  

inf     700.51  471.50  331.69  190.25  146.42  

inf     inf     517.93  286.19  143.33  0.00



#### 28122022_2331
there are two ways
1) get the change, update it to the open and you also check neighbour of that changed node
 and update them and stack them in open... this way you do with every changed node u recieve
2) get the change, update its rhs and dump in open. do this to every changed node. taking care of neighbours will be done by compute shortest path function, but not move and replan.


### 04012023_1016
error generated in the case:
1)