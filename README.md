# Control Systems Solver
## Part 1 (Signal Flow Graph):
### Given:
Signal flow graph representation of the system. Assume that total number of nodes and numeric
branches gains are given.
### Required:
1- Graphical interface. <br>
2- Draw the signal flow graph showing nodes, branches, gains, ... <br>
3- Listing all forward paths, individual loops, all combination of n non-touching loops. <br>
4- The values of Δ , Δ1 , ..., Δm where m is number of forward paths. <br>
5- Overall system transfer function. <br>
## Part 2 (Routh Stability Criterion):
### Given:
Characteristic equation of the system. Assume that all the coefficients of s0
to sn are given. <br>
Input example: s^5+s^4+10s^3+72s^2+152s+240
### Required:
1- Using Routh criteria, state if the system is stable or not. <br>
2- If the system is not stable, list the number and values of poles in the RHS of the s-plane. <br>
## Main Program Features
- Signal Flow Graph graphical representation <br>
- Displaying Detailed Breakdown of Mason’s Rule <br>
˃ Forward Paths <br>
˃ Loops and Non-Touching Loops <br>
˃ Determinant of each forward path <br>
˃ Path Gains and Loop Gains <br>
˃ Overall System Transfer Function <br>
- Given a numeric system (path gains are numbers rather than strings), the program calculates
the final values of the gains. <br>
- Determining stability of a system using Routh-Hurwitz stability criterion. <br>
- Stating values of poles in right-hand-side of 𝑠-plane in case of an unstable system. <br>
## User Guide:
The user is first met with a screen containing a bar at the top, as well as three fields: Add Node, Add
Edge, and Transfer Function. <br>
To add a node, the user types in the identifier of the node (e.g. “A”), then presses “Add”, which would
then display a node in the empty space below the fields. <br>
To add an edge between two nodes, the user must specify the source node and the target node using
their identifiers, and specify whether the path gain would be numeric or non-numeric through the
“Numeric/Non-numeric” button, which switches the field to accept numeric values if “Numeric” is
pressed. After specifying the source, the target, and the gain, the user should press “Add”, which
would graphically display the edge between the two nodes. <br>
After setting up the graph, to calculate the overall transfer function and display all graph information,
the user should specify the start and end nodes in the “Transfer Function” field, then press
“Calculate”, which would display list of forward paths and their determinants, individual loops, nontouching loops, characteristic equation, and transfer function.
To switch to the Routh-Hurwitz Stability Criterion calculator, the user should press the “Routh Stability
Criterion” text in the bar at the top, which would reroute them to the fields required for calculating the
stability. <br>
The user will be met with only one field in which they will write their system’s characteristic equation.
The characteristic equation should be written in the form <sign><coefficient>s^<exponent> (e.g.
14s^3+2s^2+9s+1). <br>
After pressing “Solve”, the stability of the system will first be stated, and all the system information
(polynomial degree, coefficients, number of unstable poles and their values, number of sign changes)
and Routh-Hurwitz table will be displayed. <br>
## Sample Runs:
![WhatsApp Image 2024-04-20 at 1 37 56 PM](https://github.com/ranimeshehata/Control_Systems_Solver/assets/121239735/b7c881e0-d854-42a0-b954-eea44796c3c8)

![WhatsApp Image 2024-04-20 at 10 17 02 PM](https://github.com/ranimeshehata/Control_Systems_Solver/assets/121239735/da5da608-5f10-49e4-b8ab-f624413fcacf)

![WhatsApp Image 2024-04-20 at 10 36 44 PM](https://github.com/ranimeshehata/Control_Systems_Solver/assets/121239735/b52794e5-431b-4325-84df-b07e8271370b)

