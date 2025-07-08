openpar = ["{","(","["]
closepar = ["}",")","]"]

def getindex(arr,target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
            
def isopen(arr,target):
    isopen = False
    for i in arr:
        if target == i:
            isopen = True
    return isopen

def sortarr(arr):
    narr = arr
    newarr =[]
    for i in range(len(narr)):
       mini =arr[0]
       minidx = 0
       for x in range(1, len(narr)):
        if mini > narr[x]:
            mini = narr[x]
            minidx = x
           
       newarr.append(mini)
       narr.pop(minidx)
           
    return newarr
    
s ="((()[]{}[]))"

open = []
close = []
conso = []
consoidx = []
openidx =[]
closeidx = []
for i in range(len(s)):
    for x in range(len(openpar)):
        if s[i] == openpar[x]:
            open.append(getindex(openpar,s[i]))
            conso.append(s[i])
            consoidx.append(getindex(openpar,s[i]))
        elif s[i] == closepar[x]: 
            close.append(getindex(closepar,s[i]))
            conso.append(s[i])
            consoidx.append(getindex(closepar,s[i]))
isopennum = 0
for i in range(len(conso)):
    checkopen = False
    checkclose = False
    for x in range(len(openpar)):
        if isopen(openpar,conso[i]) == True:
            checkopen = True
        elif isopen(closepar,conso[i]) == True:
            checkclose = True
    if checkopen == True:
        openidx.append(i)
        isopennum += 1
    elif checkclose == True:
        closeidx.append(i)
        

check =True
finalop = []
finalcl = []
for i in range(len(openidx)):
    opidx = getindex(openpar,conso[openidx[i]])
    for x in range(len(closeidx)):
        if opidx == close[x]:
            if openidx[i] %2 == 0 and closeidx[x] %2 !=0:
                print("Open: ",openidx[i]," Close: ",closeidx[x])
                finalop.append(openidx[i])
                finalcl.append(closeidx[x])
            elif openidx[i] %2 != 0 and closeidx[x] %2 ==0:
                print("Open: ",openidx[i]," Close: ",closeidx[x])
                finalop.append(openidx[i])
                finalcl.append(closeidx[x])
final= len(finalop) != 0 or len(finalcl) != 0
for i in range(len(finalop)):
    if finalop[i]>finalcl[i]:
        final = False
        


    
    
# print(open)
# print(close)
# print(conso)
# print(consoidx)
# print(isopennum)
# print(openidx)
# print(closeidx)

# print(final)

print(sortarr(open))
print(sortarr(close))
print(check)
print(finalop)
print(openidx)


