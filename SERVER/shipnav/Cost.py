from netCDF4 import Dataset
import numpy as np
from typing import Tuple
import geopy
from geopy.distance import geodesic
import os
class env_factors:
    """
    currently using random path, later include the file in some folder and fetch it from there
    """
    def __init__(self, filepath="./shipnav/ww3_fcs_glo_1.0.nc"):
        #print("hey",os.getcwd)
        self.file=Dataset(filepath,mode="r")

    def maskedarrays(self, range, type):
        if type=='lon':
            ma = self.file.variables['lon'][range[0]:range[1]]
        else:
            ma = self.file.variables['lat'][70+range[0]:70+range[1]]
        return ma

    def avg_hs(self):
        hs = np.ma.getdata(self.file.variables['hs'][:])
        avg_hs=np.mean(hs,axis=0)
        return avg_hs

    def avg_uwnd(self):
        uwnd = np.ma.getdata(self.file.variables['uwnd'][:])
        avg_uwnd=np.mean(uwnd,axis=0)
        return avg_uwnd
    
    def avg_vwnd(self):
        vwnd = np.ma.getdata(self.file.variables['vwnd'][:])
        avg_vwnd=np.mean(vwnd,axis=0)
        return avg_vwnd

class distances:

    def __init__(self,s:Tuple[int,int],d:Tuple[int,int]):
        self.s= s
        self.d= d
    def heuristic(self):
        return geodesic((self.s.lat,self.s.lon),(self.d.lat,self.d.lon)).km


"""
"""
