class Solution(object):
    def groupAnagrams(self, strs):
        """
        :type strs: List[str]
        :rtype: List[List[str]]
        """
        
        group = []
        for i in strs:
            newarr = [i]
            group.append(newarr)
        return group 
        

strs = ["eat","tea","tan","ate","nat","bat"]
sl = Solution()
print(sl.groupAnagrams(strs))